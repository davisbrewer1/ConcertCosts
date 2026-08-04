"use client";

import { useEffect, useState } from "react";
import { RecommendationResults } from "@/components/RecommendationResults";
import { RecommendationWizard } from "@/components/RecommendationWizard";
import type { ConcertRecommendation } from "@/lib/recommendation/generate";

type Profile = {
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

export function RecommendationsClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendations, setRecommendations] = useState<
    ConcertRecommendation[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/recommendations");
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Could not load recommendations.");
          return;
        }
        if (!cancelled) {
          setProfile(data.profile);
          setRecommendations(data.recommendations ?? []);
          setEditing(Boolean(data.needsPreferences));
        }
      } catch {
        if (!cancelled) setError("Could not load recommendations.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (editing || !profile) {
    return (
      <RecommendationWizard
        initial={profile ?? undefined}
        onComplete={(recs, savedProfile) => {
          setRecommendations(recs);
          if (savedProfile) {
            setProfile({
              home_city: savedProfile.home_city ?? "",
              home_state: savedProfile.home_state ?? "",
              max_drive_miles: savedProfile.max_drive_miles ?? 150,
              willing_to_fly: Boolean(savedProfile.willing_to_fly),
              max_fly_miles: savedProfile.max_fly_miles ?? 1500,
              genres: savedProfile.genres ?? [],
              eras: savedProfile.eras ?? [],
              liked_artists: savedProfile.liked_artists ?? [],
              disliked_artists: savedProfile.disliked_artists ?? [],
            });
          }
          setEditing(false);
        }}
      />
    );
  }

  return (
    <RecommendationResults
      recommendations={recommendations}
      onEditPreferences={() => setEditing(true)}
    />
  );
}
