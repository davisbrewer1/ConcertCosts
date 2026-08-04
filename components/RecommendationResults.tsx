import type { ConcertRecommendation } from "@/lib/recommendation/generate";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function travelLabel(rec: ConcertRecommendation): string {
  if (rec.travelMode === "local") return "Nearby / local";
  if (rec.travelMode === "drive") {
    return `About ${rec.travelHours} hr drive · ${rec.distanceMiles} miles`;
  }
  return `About ${rec.travelHours} hr flight · ${rec.distanceMiles} miles`;
}

export function RecommendationResults({
  recommendations,
  onEditPreferences,
}: {
  recommendations: ConcertRecommendation[];
  onEditPreferences: () => void;
}) {
  if (recommendations.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body items-center text-center gap-3 py-12">
          <h3 className="font-display text-xl font-bold">No matching shows right now</h3>
          <p className="opacity-70 max-w-md">
            We couldn’t find live concerts that fit your travel range and taste
            from today’s listings. Try widening your drive/fly distance or
            adding more genres.
          </p>
          <button type="button" className="btn btn-primary" onClick={onEditPreferences}>
            Update preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="opacity-70">
          Real upcoming shows matched to your home base, travel range, and taste.
        </p>
        <button type="button" className="btn btn-outline btn-sm" onClick={onEditPreferences}>
          Update preferences
        </button>
      </div>

      <div className="grid gap-4">
        {recommendations.map((rec) => (
          <article
            key={rec.id}
            className="card bg-base-100 border border-base-300 shadow-sm"
          >
            <div className="card-body gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h3 className="card-title font-display text-xl">{rec.artist}</h3>
                  <p className="opacity-80">{rec.title}</p>
                  <p className="text-sm opacity-60">
                    {rec.venue} · {rec.city}
                  </p>
                </div>
                <div className="badge badge-outline h-auto py-2">
                  {formatWhen(rec.startsAt)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary badge-outline">
                  {travelLabel(rec)}
                </span>
                {rec.overnightSuggested && (
                  <span className="badge badge-secondary badge-outline">
                    Overnight stay may help
                  </span>
                )}
              </div>

              {rec.matchReasons.length > 0 && (
                <ul className="text-sm opacity-80 list-disc list-inside">
                  {rec.matchReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}

              <div className="card-actions justify-end pt-1">
                {rec.gigoraUrl && (
                  <a
                    href={rec.gigoraUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-ghost"
                  >
                    View on Gigora
                  </a>
                )}
                {rec.ticketUrl && (
                  <a
                    href={rec.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    Ticket link
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs opacity-50 text-center">
        Event data via Gigora. Listings change often — always confirm on the
        official ticket page.
      </p>
    </div>
  );
}
