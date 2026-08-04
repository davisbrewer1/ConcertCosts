import {
  formatCurrency,
  formatNumber,
  withConcertMetrics,
} from "@/lib/calculations";
import type { Concert } from "@/lib/types";

type MetricConcert = ReturnType<typeof withConcertMetrics>;

export function DashboardStats({ concerts }: { concerts: Concert[] }) {
  const enriched: MetricConcert[] = concerts.map(withConcertMetrics);

  const totalConcerts = enriched.length;
  const totalSpent = enriched.reduce((sum, c) => sum + c.totalCost, 0);
  const avgCost = totalConcerts ? totalSpent / totalConcerts : 0;
  const avgFun = totalConcerts
    ? enriched.reduce((sum, c) => sum + Number(c.fun_rating), 0) / totalConcerts
    : 0;

  const costPerHourValues = enriched
    .map((c) => c.costPerHour)
    .filter((v): v is number => v != null);
  const avgCostPerHour = costPerHourValues.length
    ? costPerHourValues.reduce((a, b) => a + b, 0) / costPerHourValues.length
    : null;

  const bestValue = enriched
    .filter((c) => c.funPointsPer100 != null)
    .sort((a, b) => (b.funPointsPer100 ?? 0) - (a.funPointsPer100 ?? 0))[0];

  const mostExpensive = [...enriched].sort(
    (a, b) => b.totalCost - a.totalCost,
  )[0];

  const highestFun = [...enriched].sort(
    (a, b) => Number(b.fun_rating) - Number(a.fun_rating),
  )[0];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total concerts" value={String(totalConcerts)} />
      <StatCard label="Total amount spent" value={formatCurrency(totalSpent)} />
      <StatCard
        label="Average cost per concert"
        value={formatCurrency(avgCost)}
      />
      <StatCard
        label="Average fun rating"
        value={`${formatNumber(avgFun, 1)} / 10`}
      />
      <StatCard
        label="Average cost per hour"
        value={
          avgCostPerHour == null ? "N/A" : formatCurrency(avgCostPerHour)
        }
      />
      <StatCard
        label="Best value concert"
        value={bestValue?.concert_name ?? "N/A"}
        hint={
          bestValue?.funPointsPer100 != null
            ? `${formatNumber(bestValue.funPointsPer100, 2)} fun pts / $100`
            : undefined
        }
      />
      <StatCard
        label="Most expensive concert"
        value={mostExpensive?.concert_name ?? "N/A"}
        hint={
          mostExpensive
            ? formatCurrency(mostExpensive.totalCost)
            : undefined
        }
      />
      <StatCard
        label="Highest fun rating"
        value={highestFun?.concert_name ?? "N/A"}
        hint={highestFun ? `${highestFun.fun_rating}/10` : undefined}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-4 gap-1">
        <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
        <p className="font-display text-xl font-bold leading-snug break-words">
          {value}
        </p>
        {hint && <p className="text-sm opacity-70">{hint}</p>}
      </div>
    </div>
  );
}
