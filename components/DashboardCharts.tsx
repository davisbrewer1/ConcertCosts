"use client";

import {
  Bar,
  BarChart,
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
import { withConcertMetrics } from "@/lib/calculations";
import { COST_CATEGORIES, type Concert } from "@/lib/types";

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

export function DashboardCharts({ concerts }: { concerts: Concert[] }) {
  const enriched = concerts.map(withConcertMetrics);

  const categoryTotals = COST_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: concerts.reduce((sum, c) => sum + Number(c[cat.key] || 0), 0),
  })).filter((row) => row.value > 0);

  const byConcert = enriched.map((c) => ({
    name:
      c.concert_name.length > 16
        ? `${c.concert_name.slice(0, 16)}…`
        : c.concert_name,
    fullName: c.concert_name,
    totalCost: Number(c.totalCost.toFixed(2)),
    fun: Number(c.fun_rating),
    funPer100:
      c.funPointsPer100 == null
        ? 0
        : Number(c.funPointsPer100.toFixed(2)),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Spending by cost category">
        {categoryTotals.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryTotals}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name }) => name}
              >
                {categoryTotals.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? `$${value.toFixed(2)}`
                    : String(value ?? "")
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Total cost by concert">
        {byConcert.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? `$${value.toFixed(2)}`
                    : String(value ?? "")
                }
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="totalCost" name="Total cost" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Fun rating by concert">
        {byConcert.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar dataKey="fun" name="Fun rating" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Fun Points per $100 by concert">
        {byConcert.length === 0 ? (
          <ChartEmpty />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar
                dataKey="funPer100"
                name="Fun Points / $100"
                fill="#34d399"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <h3 className="font-display font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm opacity-60">
      Add concerts to populate this chart.
    </div>
  );
}
