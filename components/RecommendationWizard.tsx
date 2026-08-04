"use client";

import { useMemo, useState } from "react";
import {
  getPromptArtists,
  MUSIC_ERAS,
  MUSIC_GENRES,
} from "@/lib/recommendation/catalog";
import type { ConcertRecommendation } from "@/lib/recommendation/generate";

export type WizardProfile = {
  home_city?: string;
  home_state?: string;
  max_drive_miles?: number;
  willing_to_fly?: boolean;
  max_fly_miles?: number;
  genres?: string[];
  eras?: string[];
  liked_artists?: string[];
  disliked_artists?: string[];
};

type WizardProps = {
  onComplete: (
    recommendations: ConcertRecommendation[],
    profile?: WizardProfile | null,
  ) => void;
  initial?: WizardProfile;
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
  "NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY",
];

export function RecommendationWizard({ onComplete, initial }: WizardProps) {
  const [step, setStep] = useState(0);
  const [homeCity, setHomeCity] = useState(initial?.home_city ?? "");
  const [homeState, setHomeState] = useState(initial?.home_state ?? "");
  const [maxDrive, setMaxDrive] = useState(String(initial?.max_drive_miles ?? 150));
  const [willingToFly, setWillingToFly] = useState(initial?.willing_to_fly ?? false);
  const [maxFly, setMaxFly] = useState(String(initial?.max_fly_miles ?? 1500));
  const [genres, setGenres] = useState<string[]>(initial?.genres ?? []);
  const [eras, setEras] = useState<string[]>(initial?.eras ?? []);
  const [liked, setLiked] = useState<string[]>(initial?.liked_artists ?? []);
  const [disliked, setDisliked] = useState<string[]>(initial?.disliked_artists ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptArtists = useMemo(
    () => getPromptArtists(genres, eras, 10),
    [genres, eras],
  );

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function rateArtist(name: string, rating: "like" | "dislike" | "skip") {
    setLiked((prev) => prev.filter((a) => a !== name));
    setDisliked((prev) => prev.filter((a) => a !== name));
    if (rating === "like") setLiked((prev) => [...prev, name]);
    if (rating === "dislike") setDisliked((prev) => [...prev, name]);
  }

  function artistRating(name: string): "like" | "dislike" | "skip" {
    if (liked.includes(name)) return "like";
    if (disliked.includes(name)) return "dislike";
    return "skip";
  }

  async function finish() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_city: homeCity,
          home_state: homeState,
          max_drive_miles: Number(maxDrive),
          willing_to_fly: willingToFly,
          max_fly_miles: Number(maxFly),
          genres,
          eras,
          liked_artists: liked,
          disliked_artists: disliked,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save your preferences.");
        setLoading(false);
        return;
      }
      onComplete(data.recommendations ?? [], data.profile ?? null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const steps = ["Home base", "Travel", "Genres", "Eras", "Bands"];

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-5">
        <div>
          <h2 className="font-display text-2xl font-bold">Tell us your taste</h2>
          <p className="opacity-70 text-sm">
            We’ll use this to find real upcoming concerts near you.
          </p>
        </div>

        <ul className="steps steps-horizontal w-full text-xs sm:text-sm">
          {steps.map((label, i) => (
            <li key={label} className={`step ${i <= step ? "step-primary" : ""}`}>
              <span className="hidden sm:inline">{label}</span>
            </li>
          ))}
        </ul>

        {step === 0 && (
          <div className="space-y-4">
            <p className="font-medium">Where do you live?</p>
            <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
              <label className="form-control">
                <span className="label-text mb-1">City</span>
                <input
                  className="input input-bordered"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  placeholder="Oxford"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1">State</span>
                <select
                  className="select select-bordered"
                  value={homeState}
                  onChange={(e) => setHomeState(e.target.value)}
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="font-medium mb-2">How far would you drive for a show?</p>
              <label className="form-control max-w-xs">
                <span className="label-text mb-1">Max driving distance (miles)</span>
                <input
                  type="number"
                  min={10}
                  max={800}
                  className="input input-bordered"
                  value={maxDrive}
                  onChange={(e) => setMaxDrive(e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className="font-medium">Are you willing to fly for a concert?</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`btn ${willingToFly ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setWillingToFly(true)}
                >
                  Yes, I can fly
                </button>
                <button
                  type="button"
                  className={`btn ${!willingToFly ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setWillingToFly(false)}
                >
                  No, driving only
                </button>
              </div>
              {willingToFly && (
                <label className="form-control max-w-xs">
                  <span className="label-text mb-1">Max flying distance (miles)</span>
                  <input
                    type="number"
                    min={200}
                    max={3000}
                    className="input input-bordered"
                    value={maxFly}
                    onChange={(e) => setMaxFly(e.target.value)}
                  />
                  <span className="label-text-alt opacity-60 mt-1">
                    Example: 800 ≈ a short hop, 1500 ≈ cross-country-ish
                  </span>
                </label>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="font-medium">What genres do you like? (pick one or more)</p>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map((g) => {
                const on = genres.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`btn btn-sm ${on ? "btn-primary" : "btn-outline"}`}
                    onClick={() => toggle(genres, g.id, setGenres)}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="font-medium">Which eras of music do you enjoy?</p>
            <div className="flex flex-wrap gap-2">
              {MUSIC_ERAS.map((era) => {
                const on = eras.includes(era.id);
                return (
                  <button
                    key={era.id}
                    type="button"
                    className={`btn btn-sm ${on ? "btn-primary" : "btn-outline"}`}
                    onClick={() => toggle(eras, era.id, setEras)}
                  >
                    {era.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="font-medium">
              Quick band check — like, skip, or no thanks
            </p>
            <p className="text-sm opacity-70">
              Based on your genres and eras. You can skip any you don’t know.
            </p>
            <div className="space-y-3">
              {promptArtists.map((name) => {
                const rating = artistRating(name);
                return (
                  <div
                    key={name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-box border border-base-300 p-3"
                  >
                    <span className="font-medium">{name}</span>
                    <div className="join">
                      <button
                        type="button"
                        className={`btn btn-sm join-item ${rating === "like" ? "btn-success" : "btn-outline"}`}
                        onClick={() => rateArtist(name, "like")}
                      >
                        Like
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm join-item ${rating === "skip" ? "btn-ghost" : "btn-outline"}`}
                        onClick={() => rateArtist(name, "skip")}
                      >
                        Skip
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm join-item ${rating === "dislike" ? "btn-error" : "btn-outline"}`}
                        onClick={() => rateArtist(name, "dislike")}
                      >
                        Not for me
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2 pt-2">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={step === 0 || loading}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (step === 0 && (!homeCity.trim() || !homeState)) {
                  setError("Enter your city and state to continue.");
                  return;
                }
                if (step === 2 && genres.length === 0) {
                  setError("Pick at least one genre.");
                  return;
                }
                if (step === 3 && eras.length === 0) {
                  setError("Pick at least one era.");
                  return;
                }
                setError(null);
                setStep((s) => s + 1);
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              disabled={loading}
              onClick={finish}
            >
              {loading ? "Finding concerts..." : "See recommendations"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
