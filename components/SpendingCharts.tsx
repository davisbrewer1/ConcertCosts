"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatCurrency,
  formatPercent,
  getCategoryBreakdown,
  getSpendingOverTime,
} from "@/lib/spending";
import type { Concert } from "@/lib/types";

const COLORS = [
  "#60a5fa",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#38bdf8",
  "#fb7185",
  "#4ade80",
];

export function SpendingCharts({ concerts }: { concerts: Concert[] }) {
  const overTime = getSpendingOverTime(concerts);
  const { categories, grandTotal } = getCategoryBreakdown(concerts);

  const pieData = categories.map((c) => ({
    name: c.label,
    value: c.amount,
    percent: c.percent,
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Total spent"
          value={formatCurrency(grandTotal)}
        />
        <Stat
          label="Concerts logged"
          value={String(concerts.length)}
        />
        <Stat
          label="Avg per concert"
          value={
            concerts.length
              ? formatCurrency(grandTotal / concerts.length)
              : formatCurrency(0)
          }
        />
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h3 className="font-display font-semibold text-lg">
            Spending over time
          </h3>
          <p className="text-sm opacity-70 -mt-1">
            Total concert costs by month (based on the concert date).
          </p>
          {overTime.length === 0 ? (
            <ChartEmpty />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={overTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? formatCurrency(value)
                      : String(value ?? "")
                  }
                  labelFormatter={(label, payload) => {
                    const concerts = payload?.[0]?.payload?.concerts;
                    return concerts
                      ? `${label} · ${concerts} concert${concerts === 1 ? "" : "s"}`
                      : String(label);
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total spent"
                  stroke="#60a5fa"
                  fill="url(#spendFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h3 className="font-display font-semibold text-lg">
              Spending by category
            </h3>
            <p className="text-sm opacity-70 -mt-1">
              Share of your total spending across cost types.
            </p>
            {pieData.length === 0 ? (
              <ChartEmpty />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _name, item) => {
                      const percent = item?.payload?.percent;
                      const money =
                        typeof value === "number"
                          ? formatCurrency(value)
                          : String(value ?? "");
                      return percent != null
                        ? `${money} (${formatPercent(percent)})`
                        : money;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h3 className="font-display font-semibold text-lg">
              Category breakdown
            </h3>
            <p className="text-sm opacity-70 -mt-1">
              Exact amounts and percent of total spent.
            </p>

            {categories.length === 0 ? (
              <ChartEmpty />
            ) : (
              <div className="space-y-3 mt-2">
                {categories.map((cat, i) => (
                  <div key={cat.key} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        {cat.label}
                      </span>
                      <span className="opacity-80 whitespace-nowrap">
                        {formatCurrency(cat.amount)} · {formatPercent(cat.percent)}
                      </span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={cat.percent}
                      max={100}
                    />
                  </div>
                ))}
                <div className="pt-2 border-t border-base-300 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-4 gap-1">
        <p className="text-xs uppercase tracking-wide opacity-60">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm opacity-60">
      Add concerts with costs to see this chart.
    </div>
  );
}
