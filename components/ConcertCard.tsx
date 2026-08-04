import { ShareRecapButton } from "@/components/ShareRecapButton";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  withConcertMetrics,
} from "@/lib/calculations";
import { COST_CATEGORIES, type Concert } from "@/lib/types";

export function ConcertCard({ concert }: { concert: Concert }) {
  const metrics = withConcertMetrics(concert);
  const costs = COST_CATEGORIES.map((cat) => ({
    ...cat,
    amount: Number(concert[cat.key] || 0),
  })).filter((c) => c.amount > 0);

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="card-body gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h3 className="card-title font-display text-xl">
              {concert.concert_name}
            </h3>
            <p className="opacity-80">{concert.artist}</p>
            <p className="text-sm opacity-60">
              {concert.venue} · {concert.city}, {concert.state}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="badge badge-outline">
              {formatDate(concert.concert_date)}
            </div>
            <ShareRecapButton concert={concert} />
          </div>
        </div>

        <div className="stats stats-vertical sm:stats-horizontal shadow-none bg-base-200/50 w-full">
          <div className="stat place-items-start py-3">
            <div className="stat-title">Total cost</div>
            <div className="stat-value text-2xl text-primary">
              {formatCurrency(metrics.totalCost)}
            </div>
          </div>
          <div className="stat place-items-start py-3">
            <div className="stat-title">Fun rating</div>
            <div className="stat-value text-2xl">{metrics.fun_rating}/10</div>
          </div>
          <div className="stat place-items-start py-3">
            <div className="stat-title">Cost / hour</div>
            <div className="stat-value text-2xl">
              {metrics.costPerHour == null
                ? "N/A"
                : formatCurrency(metrics.costPerHour)}
            </div>
          </div>
          <div className="stat place-items-start py-3">
            <div className="stat-title">Fun Points / $100</div>
            <div className="stat-value text-2xl">
              {metrics.funPointsPer100 == null
                ? "N/A"
                : formatNumber(metrics.funPointsPer100, 2)}
            </div>
          </div>
        </div>

        {costs.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 opacity-80">
              Main cost categories
            </p>
            <div className="flex flex-wrap gap-2">
              {costs.map((cost) => (
                <span key={cost.key} className="badge badge-ghost gap-1">
                  {cost.label}: {formatCurrency(cost.amount)}
                </span>
              ))}
            </div>
          </div>
        )}

        {concert.notes && (
          <div className="rounded-box bg-base-200/60 p-3 text-sm">
            <p className="font-medium mb-1 opacity-80">Notes</p>
            <p className="opacity-90 whitespace-pre-wrap">{concert.notes}</p>
          </div>
        )}
      </div>
    </article>
  );
}
