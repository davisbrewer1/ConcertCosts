export type City = {
  city: string;
  state: string;
  lat: number;
  lng: number;
};

/** Major US cities used to expand Gigora searches beyond the home city. */
export const US_CITIES: City[] = [
  { city: "New York", state: "NY", lat: 40.7128, lng: -74.006 },
  { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
  { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
  { city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074 },
  { city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
  { city: "San Antonio", state: "TX", lat: 29.4241, lng: -98.4936 },
  { city: "San Diego", state: "CA", lat: 32.7157, lng: -117.1611 },
  { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.797 },
  { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  { city: "San Jose", state: "CA", lat: 37.3382, lng: -121.8863 },
  { city: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557 },
  { city: "Fort Worth", state: "TX", lat: 32.7555, lng: -97.3308 },
  { city: "Columbus", state: "OH", lat: 39.9612, lng: -82.9988 },
  { city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
  { city: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581 },
  { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
  { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
  { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  { city: "Oklahoma City", state: "OK", lat: 35.4676, lng: -97.5164 },
  { city: "Nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
  { city: "El Paso", state: "TX", lat: 31.7619, lng: -106.485 },
  { city: "Washington", state: "DC", lat: 38.9072, lng: -77.0369 },
  { city: "Las Vegas", state: "NV", lat: 36.1699, lng: -115.1398 },
  { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
  { city: "Portland", state: "OR", lat: 45.5152, lng: -122.6784 },
  { city: "Detroit", state: "MI", lat: 42.3314, lng: -83.0458 },
  { city: "Memphis", state: "TN", lat: 35.1495, lng: -90.049 },
  { city: "Louisville", state: "KY", lat: 38.2527, lng: -85.7585 },
  { city: "Baltimore", state: "MD", lat: 39.2904, lng: -76.6122 },
  { city: "Milwaukee", state: "WI", lat: 43.0389, lng: -87.9065 },
  { city: "Albuquerque", state: "NM", lat: 35.0844, lng: -106.6504 },
  { city: "Tucson", state: "AZ", lat: 32.2226, lng: -110.9747 },
  { city: "Fresno", state: "CA", lat: 36.7378, lng: -119.7871 },
  { city: "Sacramento", state: "CA", lat: 38.5816, lng: -121.4944 },
  { city: "Atlanta", state: "GA", lat: 33.749, lng: -84.388 },
  { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
  { city: "Raleigh", state: "NC", lat: 35.7796, lng: -78.6382 },
  { city: "Omaha", state: "NE", lat: 41.2565, lng: -95.9345 },
  { city: "Kansas City", state: "MO", lat: 39.0997, lng: -94.5786 },
  { city: "New Orleans", state: "LA", lat: 29.9511, lng: -90.0715 },
  { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
  { city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792 },
  { city: "St. Louis", state: "MO", lat: 38.627, lng: -90.1994 },
  { city: "Pittsburgh", state: "PA", lat: 40.4406, lng: -79.9959 },
  { city: "Cincinnati", state: "OH", lat: 39.1031, lng: -84.512 },
  { city: "Cleveland", state: "OH", lat: 41.4993, lng: -81.6944 },
  { city: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.265 },
  { city: "Salt Lake City", state: "UT", lat: 40.7608, lng: -111.891 },
  { city: "Birmingham", state: "AL", lat: 33.5186, lng: -86.8104 },
  { city: "Jackson", state: "MS", lat: 32.2988, lng: -90.1848 },
  { city: "Oxford", state: "MS", lat: 34.3665, lng: -89.5192 },
  { city: "Little Rock", state: "AR", lat: 34.7465, lng: -92.2896 },
  { city: "Tulsa", state: "OK", lat: 36.154, lng: -95.9928 },
  { city: "Richmond", state: "VA", lat: 37.5407, lng: -77.436 },
  { city: "Norfolk", state: "VA", lat: 36.8508, lng: -76.2859 },
  { city: "Buffalo", state: "NY", lat: 42.8864, lng: -78.8784 },
  { city: "Rochester", state: "NY", lat: 43.1566, lng: -77.6088 },
  { city: "Providence", state: "RI", lat: 41.824, lng: -71.4128 },
  { city: "Hartford", state: "CT", lat: 41.7658, lng: -72.6734 },
  { city: "Honolulu", state: "HI", lat: 21.3069, lng: -157.8583 },
  { city: "Anchorage", state: "AK", lat: 61.2181, lng: -149.9003 },
];

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function findCityCoords(city: string, state: string): City | null {
  const c = city.trim().toLowerCase();
  const s = state.trim().toLowerCase();
  return (
    US_CITIES.find(
      (item) =>
        item.city.toLowerCase() === c && item.state.toLowerCase() === s,
    ) ??
    US_CITIES.find((item) => item.city.toLowerCase() === c) ??
    null
  );
}

export async function geocodeCityState(
  city: string,
  state: string,
): Promise<{ lat: number; lng: number } | null> {
  const known = findCityCoords(city, state);
  if (known) return { lat: known.lat, lng: known.lng };

  const params = new URLSearchParams({
    city,
    state,
    country: "USA",
    format: "json",
    limit: "1",
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent": "ConcertCostTracker/1.0 (student project)",
          Accept: "application/json",
        },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data[0]) return null;
    return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  } catch {
    return null;
  }
}

export function estimateTravel(distanceMiles: number, maxDriveMiles: number) {
  const driveHours = distanceMiles / 55;
  if (distanceMiles <= maxDriveMiles) {
    return {
      mode: "drive" as const,
      distanceMiles: Math.round(distanceMiles),
      travelHours: Number(driveHours.toFixed(1)),
      overnightSuggested: driveHours > 3.5,
    };
  }
  // Rough commercial flight block time: taxi + cruise (~500 mph) + buffers
  const flyHours = Math.max(1.5, distanceMiles / 500 + 1.2);
  return {
    mode: "fly" as const,
    distanceMiles: Math.round(distanceMiles),
    travelHours: Number(flyHours.toFixed(1)),
    overnightSuggested: true,
  };
}
