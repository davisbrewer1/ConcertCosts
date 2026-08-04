"use client";

import type { RefObject } from "react";
import { formatDate } from "@/lib/calculations";
import type { Concert } from "@/lib/types";

export function ConcertRecapCard({
  concert,
  cardRef,
}: {
  concert: Concert;
  cardRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={cardRef}
      className="relative w-[360px] overflow-hidden rounded-3xl text-left shadow-2xl"
      style={{ color: "#fff7ed" }}
    >
      {/* Original classic-rock texture (not a licensed album cover) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/concert-recap-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        crossOrigin="anonymous"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,10,8,0.74) 0%, rgba(20,12,10,0.80) 45%, rgba(12,8,6,0.90) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(185,28,28,0.35), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 p-6 space-y-5 min-h-[520px] flex flex-col">
        <div className="space-y-2">
          <p
            className="text-[11px] uppercase tracking-[0.22em] font-semibold"
            style={{ color: "#fecaca" }}
          >
            Concert recap
          </p>
          <h3
            className="font-display text-3xl font-bold leading-tight"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.65)" }}
          >
            {concert.concert_name}
          </h3>
          <p
            className="text-lg font-medium"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
          >
            {concert.artist}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#fde68a" }}>
            {concert.venue}
            <br />
            {concert.city}, {concert.state}
            <br />
            {formatDate(concert.concert_date)}
          </p>
        </div>

        <div
          className="rounded-2xl px-4 py-4 border"
          style={{
            background: "rgba(0,0,0,0.45)",
            borderColor: "rgba(254,202,202,0.25)",
          }}
        >
          <p
            className="text-[11px] uppercase tracking-wide"
            style={{ color: "#fecaca" }}
          >
            Fun rating
          </p>
          <p className="font-display text-4xl font-bold mt-1">
            {concert.fun_rating}
            <span className="text-xl opacity-80"> / 10</span>
          </p>
          <p className="text-xs mt-1 opacity-80">
            {concert.fun_rating >= 9
              ? "Best Time Ever energy"
              : concert.fun_rating <= 3
                ? "Rough night"
                : "A night worth remembering"}
          </p>
        </div>

        {concert.notes?.trim() && (
          <p
            className="text-sm leading-snug line-clamp-4 rounded-2xl px-4 py-3 border"
            style={{
              background: "rgba(0,0,0,0.45)",
              borderColor: "rgba(253,230,138,0.2)",
            }}
          >
            “{concert.notes.trim()}”
          </p>
        )}

        <p
          className="mt-auto pt-2 text-center text-[11px] uppercase tracking-[0.18em] font-semibold"
          style={{ color: "#fecaca" }}
        >
          Concert Cost Tracker
        </p>
      </div>
    </div>
  );
}
