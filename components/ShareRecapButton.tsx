"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ConcertRecapCard } from "@/components/ConcertRecapCard";
import type { Concert } from "@/lib/types";

export function ShareRecapButton({ concert }: { concert: Concert }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function open() {
    setMessage(null);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  async function downloadPng() {
    if (!cardRef.current) return;
    setBusy(true);
    setMessage(null);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      const safeName = concert.concert_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      link.download = `${safeName || "concert"}-recap.png`;
      link.href = dataUrl;
      link.click();
      setMessage("Image downloaded — ready to share!");
    } catch {
      setMessage("Couldn’t create the image. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copySummary() {
    const metricsNote = [
      `${concert.concert_name} — ${concert.artist}`,
      `${concert.venue} · ${concert.city}, ${concert.state}`,
      `Date: ${concert.concert_date}`,
      `Fun: ${concert.fun_rating}/10`,
      "Tracked with Concert Cost Tracker",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(metricsNote);
      setMessage("Text summary copied to clipboard.");
    } catch {
      setMessage("Couldn’t copy text. You can still download the image.");
    }
  }

  return (
    <>
      <button type="button" className="btn btn-outline btn-sm" onClick={open}>
        Share recap
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-lg bg-base-100">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>

          <h3 className="font-display text-xl font-bold">Concert recap card</h3>
          <p className="text-sm opacity-70 mb-4">
            Preview your shareable card, then download it as an image.
          </p>

          <div className="flex justify-center py-2 overflow-x-auto">
            <ConcertRecapCard concert={concert} cardRef={cardRef} />
          </div>

          {message && (
            <div role="status" className="alert alert-info text-sm mt-4 py-2">
              <span>{message}</span>
            </div>
          )}

          <div className="modal-action flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={copySummary}
              disabled={busy}
            >
              Copy text
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={downloadPng}
              disabled={busy}
            >
              {busy ? "Creating image..." : "Download image"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>
    </>
  );
}
