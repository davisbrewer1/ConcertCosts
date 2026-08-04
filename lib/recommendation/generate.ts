import { MUSIC_ERAS, MUSIC_GENRES, genresToGigoraParams } from "./catalog";
import {
  estimateTravel,
  findCityCoords,
  geocodeCityState,
  haversineMiles,
  US_CITIES,
} from "./geo";
import { fetchGigoraEvents, type GigoraEvent } from "./gigora";

export type RecommendationProfileInput = {
  home_city: string;
  home_state: string;
  home_lat?: number | null;
  home_lng?: number | null;
  max_drive_miles: number;
  willing_to_fly: boolean;
  max_fly_miles: number;
  genres: string[];
  eras: string[];
  liked_artists: string[];
  disliked_artists: string[];
};

export type ConcertRecommendation = {
  id: string;
  title: string;
  artist: string;
  venue: string;
  city: string;
  country: string;
  startsAt: string;
  travelMode: "drive" | "fly" | "local";
  distanceMiles: number;
  travelHours: number;
  overnightSuggested: boolean;
  matchReasons: string[];
  ticketUrl: string | null;
  gigoraUrl: string | null;
  score: number;
};

type EventWithSource = GigoraEvent & {
  sourceCity: string;
  sourceMiles: number;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUnitedStates(country: string | null | undefined): boolean {
  if (!country) return true;
  return /united states|^usa$|^us$/i.test(country.trim());
}

function artistMentioned(event: GigoraEvent, artist: string): boolean {
  const needle = normalize(artist);
  if (!needle) return false;
  const hay = normalize(`${event.headliner ?? ""} ${event.title ?? ""}`);
  return hay.includes(needle);
}

function eventKey(event: GigoraEvent): string {
  return [
    event.starts_at,
    event.venue?.name,
    event.venue?.city,
    event.headliner ?? event.title,
  ]
    .map((v) => normalize(String(v ?? "")))
    .join("|");
}

async function resolveHome(
  profile: RecommendationProfileInput,
): Promise<{ lat: number; lng: number; city: string; state: string }> {
  if (profile.home_lat != null && profile.home_lng != null) {
    return {
      lat: Number(profile.home_lat),
      lng: Number(profile.home_lng),
      city: profile.home_city,
      state: profile.home_state,
    };
  }

  const known = findCityCoords(profile.home_city, profile.home_state);
  if (known) {
    return {
      lat: known.lat,
      lng: known.lng,
      city: known.city,
      state: known.state,
    };
  }

  const coords = await geocodeCityState(profile.home_city, profile.home_state);
  if (coords) {
    return {
      ...coords,
      city: profile.home_city,
      state: profile.home_state,
    };
  }

  // Sensible US fallback so searches still work
  return {
    lat: 36.1627,
    lng: -86.7816,
    city: "Nashville",
    state: "TN",
  };
}

function pickSearchCities(
  home: { lat: number; lng: number; city: string },
  profile: RecommendationProfileInput,
): Array<{ city: string; miles: number }> {
  const maxReach = profile.willing_to_fly
    ? Math.max(profile.max_drive_miles, profile.max_fly_miles)
    : profile.max_drive_miles;

  const ranked = US_CITIES.map((c) => ({
    city: c.city,
    miles: haversineMiles(home.lat, home.lng, c.lat, c.lng),
  }))
    .filter((c) => c.miles <= maxReach)
    .sort((a, b) => a.miles - b.miles);

  const selected: Array<{ city: string; miles: number }> = [];

  // Prefer known US music hubs from our city list over ambiguous home names
  // (e.g. "Oxford" alone often maps to the UK in Gigora).
  const homeInList = US_CITIES.find(
    (c) => c.city.toLowerCase() === home.city.toLowerCase(),
  );
  if (homeInList) {
    selected.push({ city: homeInList.city, miles: 0 });
  }

  for (const city of ranked) {
    if (selected.some((s) => s.city.toLowerCase() === city.city.toLowerCase())) {
      continue;
    }
    selected.push(city);
    if (selected.length >= 10) break;
  }

  // Guarantee at least a few popular US cities if range is very tight
  if (selected.length < 3) {
    for (const fallback of ["Nashville", "Memphis", "Atlanta", "Austin", "Chicago"]) {
      const match = US_CITIES.find((c) => c.city === fallback);
      if (!match) continue;
      const miles = haversineMiles(home.lat, home.lng, match.lat, match.lng);
      if (selected.some((s) => s.city === fallback)) continue;
      if (miles <= maxReach || profile.willing_to_fly) {
        selected.push({ city: fallback, miles });
      }
      if (selected.length >= 5) break;
    }
  }

  return selected;
}

function scoreEvent(
  event: GigoraEvent,
  profile: RecommendationProfileInput,
  distanceMiles: number,
): { score: number; reasons: string[] } {
  let score = 10;
  const reasons: string[] = [];

  score += Math.max(0, 40 - distanceMiles / 25);

  for (const liked of profile.liked_artists) {
    if (artistMentioned(event, liked)) {
      score += 50;
      reasons.push(`Matches a band you liked: ${liked}`);
    }
  }

  for (const disliked of profile.disliked_artists) {
    // Only hard-exclude on headliner matches to avoid over-filtering
    if (normalize(event.headliner ?? "") === normalize(disliked)) {
      return { score: -999, reasons: [] };
    }
  }

  if (profile.genres.length) {
    const labels = profile.genres
      .map((id) => MUSIC_GENRES.find((g) => g.id === id)?.label ?? id)
      .slice(0, 3);
    reasons.push(`Based on your taste in ${labels.join(", ")}`);
    score += 8;
  }

  if (profile.eras.length) {
    const labels = profile.eras
      .map((id) => MUSIC_ERAS.find((e) => e.id === id)?.label ?? id)
      .slice(0, 2);
    reasons.push(`Fits eras you like (${labels.join(", ")})`);
    score += 4;
  }

  if (distanceMiles <= 30) {
    reasons.push("Close to home");
    score += 12;
  } else if (distanceMiles <= profile.max_drive_miles) {
    reasons.push("Within your driving range");
    score += 6;
  } else if (profile.willing_to_fly) {
    reasons.push("Within your flying range");
    score += 3;
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

function resolveEventDistance(
  event: GigoraEvent,
  home: { lat: number; lng: number; city: string },
  sourceMiles: number,
  sourceCity: string,
): number {
  const venueCity = event.venue?.city?.trim() ?? "";
  const cityMatch =
    findCityCoords(venueCity, "") ||
    US_CITIES.find((c) => c.city.toLowerCase() === venueCity.toLowerCase());

  if (cityMatch) {
    return haversineMiles(home.lat, home.lng, cityMatch.lat, cityMatch.lng);
  }
  if (normalize(venueCity) === normalize(home.city)) return 0;
  if (normalize(venueCity) === normalize(sourceCity)) return sourceMiles;
  // Fall back to the city we searched when Gigora city names don't match our list
  return sourceMiles;
}

export async function generateRecommendations(
  profile: RecommendationProfileInput,
): Promise<ConcertRecommendation[]> {
  const home = await resolveHome(profile);
  const cities = pickSearchCities(home, profile);
  const gigoraGenres = genresToGigoraParams(profile.genres);

  // Keep request count modest — Gigora can stall if we flood it.
  const searchCities = cities.slice(0, 5);
  const genresToQuery = gigoraGenres.slice(0, 2);

  const all: EventWithSource[] = [];
  for (const city of searchCities) {
    const cityEvents = await fetchGigoraEvents({ city: city.city, limit: 20 });
    all.push(
      ...cityEvents.map((event) => ({
        ...event,
        sourceCity: city.city,
        sourceMiles: city.miles,
      })),
    );

    for (const genre of genresToQuery) {
      const genreEvents = await fetchGigoraEvents({
        city: city.city,
        genre,
        limit: 10,
      });
      all.push(
        ...genreEvents.map((event) => ({
          ...event,
          sourceCity: city.city,
          sourceMiles: city.miles,
        })),
      );
    }
  }

  for (const artist of profile.liked_artists.slice(0, 3)) {
    const artistEvents = await fetchGigoraEvents({ artist, limit: 6 });
    all.push(
      ...artistEvents.map((event) => ({
        ...event,
        sourceCity: event.venue?.city || home.city,
        sourceMiles: 0,
      })),
    );
  }

  const byKey = new Map<string, EventWithSource>();
  for (const event of all) {
    const key = eventKey(event);
    const existing = byKey.get(key);
    if (!existing || event.sourceMiles < existing.sourceMiles) {
      byKey.set(key, event);
    }
  }

  const maxReach = profile.willing_to_fly
    ? Math.max(profile.max_drive_miles, profile.max_fly_miles)
    : profile.max_drive_miles;

  const recommendations: ConcertRecommendation[] = [];

  for (const event of byKey.values()) {
    const venueCity = event.venue?.city?.trim();
    if (!venueCity) continue;
    if (!isUnitedStates(event.venue.country)) continue;

    const distanceMiles = resolveEventDistance(
      event,
      home,
      event.sourceMiles,
      event.sourceCity,
    );

    if (distanceMiles > maxReach) continue;

    const { score, reasons } = scoreEvent(event, profile, distanceMiles);
    if (score < 0) continue;

    const travel =
      distanceMiles <= 15
        ? {
            mode: "local" as const,
            distanceMiles: Math.round(distanceMiles),
            travelHours: 0.3,
            overnightSuggested: false,
          }
        : estimateTravel(distanceMiles, profile.max_drive_miles);

    if (travel.mode === "fly" && !profile.willing_to_fly) continue;

    recommendations.push({
      id: eventKey(event),
      title: event.title,
      artist:
        event.headliner || event.title.split("@")[0]?.trim() || "Artist TBA",
      venue: event.venue.name,
      city: event.venue.city,
      country: event.venue.country,
      startsAt: event.starts_at,
      travelMode: travel.mode,
      distanceMiles: travel.distanceMiles,
      travelHours: travel.travelHours,
      overnightSuggested: travel.overnightSuggested,
      matchReasons: reasons,
      ticketUrl: event.ticket_url,
      gigoraUrl: event.gigora_url,
      score,
    });
  }

  // Last-resort fallback: if range/filtering wiped everything, show nearby US hubs anyway
  if (recommendations.length === 0 && byKey.size > 0) {
    for (const event of byKey.values()) {
      if (!isUnitedStates(event.venue.country)) continue;
      const distanceMiles = resolveEventDistance(
        event,
        home,
        event.sourceMiles,
        event.sourceCity,
      );
      const travel = estimateTravel(
        Math.min(distanceMiles, maxReach || 1500),
        profile.max_drive_miles,
      );
      recommendations.push({
        id: eventKey(event),
        title: event.title,
        artist:
          event.headliner || event.title.split("@")[0]?.trim() || "Artist TBA",
        venue: event.venue.name,
        city: event.venue.city,
        country: event.venue.country,
        startsAt: event.starts_at,
        travelMode: travel.mode,
        distanceMiles: Math.round(distanceMiles),
        travelHours: travel.travelHours,
        overnightSuggested: travel.overnightSuggested,
        matchReasons: ["Popular upcoming show in a city near your travel area"],
        ticketUrl: event.ticket_url,
        gigoraUrl: event.gigora_url,
        score: 1,
      });
      if (recommendations.length >= 12) break;
    }
  }

  return recommendations
    .sort((a, b) => b.score - a.score || a.distanceMiles - b.distanceMiles)
    .slice(0, 18);
}
