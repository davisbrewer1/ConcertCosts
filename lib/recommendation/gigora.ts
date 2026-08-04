export type GigoraVenue = {
  name: string;
  city: string;
  country: string;
};

export type GigoraEvent = {
  title: string;
  starts_at: string;
  venue: GigoraVenue;
  headliner: string | null;
  ticket_url: string | null;
  gigora_url: string | null;
  price_range: string | null;
};

type GigoraResponse = {
  count: number;
  events: GigoraEvent[];
};

const BASE = "https://gigora.live/api/ai/events";

export async function fetchGigoraEvents(params: {
  city?: string;
  genre?: string;
  artist?: string;
  limit?: number;
}): Promise<GigoraEvent[]> {
  const search = new URLSearchParams();
  if (params.city) search.set("city", params.city);
  if (params.genre) search.set("genre", params.genre);
  if (params.artist) search.set("artist", params.artist);
  search.set("limit", String(params.limit ?? 12));

  try {
    const res = await fetch(`${BASE}?${search.toString()}`, {
      headers: { Accept: "application/json" },
      // Don't cache empty/error responses across deploys/local restarts
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as GigoraResponse;
    return Array.isArray(data.events) ? data.events : [];
  } catch {
    return [];
  }
}
