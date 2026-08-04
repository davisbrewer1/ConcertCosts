export const MUSIC_GENRES = [
  { id: "rock", label: "Rock", gigora: "rock" },
  { id: "pop", label: "Pop", gigora: "pop" },
  { id: "country", label: "Country", gigora: "country" },
  { id: "hiphop", label: "Hip-Hop / Rap", gigora: null },
  { id: "rnb", label: "R&B / Soul", gigora: "r&b" },
  { id: "jazz", label: "Jazz", gigora: "jazz" },
  { id: "metal", label: "Metal", gigora: "metal" },
  { id: "punk", label: "Punk", gigora: "punk" },
  { id: "folk", label: "Folk / Americana", gigora: "folk" },
  { id: "electronic", label: "Electronic / Dance", gigora: null },
  { id: "indie", label: "Indie", gigora: "indie" },
  { id: "latin", label: "Latin", gigora: null },
] as const;

export const MUSIC_ERAS = [
  { id: "60s70s", label: "1960s–1970s" },
  { id: "80s", label: "1980s" },
  { id: "90s", label: "1990s" },
  { id: "2000s", label: "2000s" },
  { id: "2010s", label: "2010s" },
  { id: "today", label: "Today / Current charts" },
] as const;

export type GenreId = (typeof MUSIC_GENRES)[number]["id"];
export type EraId = (typeof MUSIC_ERAS)[number]["id"];

type ArtistSeed = {
  name: string;
  genres: GenreId[];
  eras: EraId[];
};

/** Used only to prompt “do you like this band?” — recommendations still come from live Gigora events. */
export const ARTIST_SEEDS: ArtistSeed[] = [
  { name: "The Rolling Stones", genres: ["rock"], eras: ["60s70s", "80s"] },
  { name: "Fleetwood Mac", genres: ["rock", "pop"], eras: ["60s70s", "80s"] },
  { name: "Queen", genres: ["rock"], eras: ["60s70s", "80s"] },
  { name: "Bruce Springsteen", genres: ["rock"], eras: ["60s70s", "80s", "90s"] },
  { name: "Madonna", genres: ["pop"], eras: ["80s", "90s"] },
  { name: "Prince", genres: ["pop", "rnb"], eras: ["80s", "90s"] },
  { name: "Nirvana", genres: ["rock", "punk"], eras: ["90s"] },
  { name: "Pearl Jam", genres: ["rock"], eras: ["90s", "2000s"] },
  { name: "Radiohead", genres: ["rock", "indie"], eras: ["90s", "2000s"] },
  { name: "Beyoncé", genres: ["pop", "rnb"], eras: ["2000s", "2010s", "today"] },
  { name: "Taylor Swift", genres: ["pop", "country"], eras: ["2000s", "2010s", "today"] },
  { name: "Drake", genres: ["hiphop", "rnb"], eras: ["2010s", "today"] },
  { name: "Kendrick Lamar", genres: ["hiphop"], eras: ["2010s", "today"] },
  { name: "Billie Eilish", genres: ["pop", "indie"], eras: ["2010s", "today"] },
  { name: "The Weeknd", genres: ["pop", "rnb"], eras: ["2010s", "today"] },
  { name: "Olivia Rodrigo", genres: ["pop"], eras: ["today"] },
  { name: "SZA", genres: ["rnb"], eras: ["2010s", "today"] },
  { name: "Zach Bryan", genres: ["country", "folk"], eras: ["today"] },
  { name: "Morgan Wallen", genres: ["country"], eras: ["today"] },
  { name: "Luke Combs", genres: ["country"], eras: ["2010s", "today"] },
  { name: "Metallica", genres: ["metal", "rock"], eras: ["80s", "90s", "2000s"] },
  { name: "Foo Fighters", genres: ["rock"], eras: ["90s", "2000s", "2010s"] },
  { name: "Green Day", genres: ["punk", "rock"], eras: ["90s", "2000s"] },
  { name: "Red Hot Chili Peppers", genres: ["rock"], eras: ["90s", "2000s", "2010s"] },
  { name: "Coldplay", genres: ["pop", "rock"], eras: ["2000s", "2010s", "today"] },
  { name: "Arctic Monkeys", genres: ["indie", "rock"], eras: ["2000s", "2010s"] },
  { name: "Tame Impala", genres: ["indie", "electronic"], eras: ["2010s", "today"] },
  { name: "Daft Punk", genres: ["electronic"], eras: ["90s", "2000s", "2010s"] },
  { name: "Calvin Harris", genres: ["electronic", "pop"], eras: ["2000s", "2010s", "today"] },
  { name: "Bad Bunny", genres: ["latin", "hiphop"], eras: ["2010s", "today"] },
  { name: "Shakira", genres: ["latin", "pop"], eras: ["90s", "2000s", "2010s"] },
  { name: "Miles Davis", genres: ["jazz"], eras: ["60s70s"] },
  { name: "Norah Jones", genres: ["jazz", "folk", "pop"], eras: ["2000s", "2010s"] },
  { name: "Mumford & Sons", genres: ["folk", "indie"], eras: ["2000s", "2010s"] },
  { name: "Phoebe Bridgers", genres: ["indie", "folk"], eras: ["2010s", "today"] },
  { name: "Paramore", genres: ["rock", "pop", "punk"], eras: ["2000s", "2010s", "today"] },
  { name: "Twenty One Pilots", genres: ["pop", "rock"], eras: ["2010s", "today"] },
  { name: "Post Malone", genres: ["pop", "hiphop"], eras: ["2010s", "today"] },
  { name: "Doja Cat", genres: ["pop", "hiphop", "rnb"], eras: ["2010s", "today"] },
  { name: "Tyler, The Creator", genres: ["hiphop"], eras: ["2010s", "today"] },
];

export function getPromptArtists(
  genres: string[],
  eras: string[],
  limit = 10,
): string[] {
  const genreSet = new Set(genres);
  const eraSet = new Set(eras);

  const scored = ARTIST_SEEDS.map((artist) => {
    const genreHits = artist.genres.filter((g) => genreSet.has(g)).length;
    const eraHits = artist.eras.filter((e) => eraSet.has(e)).length;
    return { name: artist.name, score: genreHits * 2 + eraHits };
  })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, limit).map((a) => a.name);

  if (picked.length >= limit) return picked;

  // Fill remaining with popular modern artists if filters were sparse
  for (const artist of ARTIST_SEEDS) {
    if (picked.length >= limit) break;
    if (!picked.includes(artist.name)) picked.push(artist.name);
  }
  return picked.slice(0, limit);
}

export function genresToGigoraParams(genres: string[]): string[] {
  const out = new Set<string>();
  for (const id of genres) {
    const match = MUSIC_GENRES.find((g) => g.id === id);
    if (match?.gigora) out.add(match.gigora);
  }
  return [...out];
}
