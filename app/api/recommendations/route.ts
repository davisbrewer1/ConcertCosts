import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateRecommendations,
  type RecommendationProfileInput,
} from "@/lib/recommendation/generate";
import { geocodeCityState } from "@/lib/recommendation/geo";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("recommendation_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!profile?.completed_at) {
    return NextResponse.json({
      needsPreferences: true,
      profile: null,
      recommendations: [],
    });
  }

  const recommendations = await generateRecommendations(
    profile as RecommendationProfileInput,
  );

  return NextResponse.json({
    needsPreferences: false,
    profile,
    recommendations,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = (await request.json()) as {
    home_city: string;
    home_state: string;
    max_drive_miles: number;
    willing_to_fly: boolean;
    max_fly_miles: number;
    genres: string[];
    eras: string[];
    liked_artists: string[];
    disliked_artists: string[];
  };

  if (!body.home_city?.trim() || !body.home_state?.trim()) {
    return NextResponse.json(
      { error: "Please enter your city and state." },
      { status: 400 },
    );
  }

  if (!body.genres?.length) {
    return NextResponse.json(
      { error: "Pick at least one music genre." },
      { status: 400 },
    );
  }

  const coords = await geocodeCityState(body.home_city, body.home_state);

  const profileRow = {
    user_id: user.id,
    home_city: body.home_city.trim(),
    home_state: body.home_state.trim().toUpperCase(),
    home_lat: coords?.lat ?? null,
    home_lng: coords?.lng ?? null,
    max_drive_miles: Number(body.max_drive_miles) || 150,
    willing_to_fly: Boolean(body.willing_to_fly),
    max_fly_miles: Number(body.max_fly_miles) || 1500,
    genres: body.genres,
    eras: body.eras ?? [],
    liked_artists: body.liked_artists ?? [],
    disliked_artists: body.disliked_artists ?? [],
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: saved, error: saveError } = await supabase
    .from("recommendation_profiles")
    .upsert(profileRow, { onConflict: "user_id" })
    .select("*")
    .single();

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  const recommendations = await generateRecommendations(
    saved as RecommendationProfileInput,
  );

  return NextResponse.json({
    needsPreferences: false,
    profile: saved,
    recommendations,
  });
}
