import { formatCurrency, getTotalCost } from "@/lib/calculations";
import { COST_CATEGORIES, type Concert } from "@/lib/types";

export type MonthlySpend = {
  monthKey: string;
  label: string;
  total: number;
  concerts: number;
};

export type CategorySpend = {
  key: string;
  label: string;
  amount: number;
  percent: number;
};

function monthKeyFromDate(dateStr: string): string {
  // concert_date is YYYY-MM-DD
  return dateStr.slice(0, 7);
}

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getSpendingOverTime(concerts: Concert[]): MonthlySpend[] {
  const map = new Map<string, MonthlySpend>();

  for (const concert of concerts) {
    if (!concert.concert_date) continue;
    const key = monthKeyFromDate(concert.concert_date);
    const existing = map.get(key) ?? {
      monthKey: key,
      label: monthLabel(key),
      total: 0,
      concerts: 0,
    };
    existing.total += getTotalCost(concert);
    existing.concerts += 1;
    map.set(key, existing);
  }

  return [...map.values()]
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .map((row) => ({
      ...row,
      total: Number(row.total.toFixed(2)),
    }));
}

export function getCategoryBreakdown(concerts: Concert[]): {
  categories: CategorySpend[];
  grandTotal: number;
} {
  const totals = COST_CATEGORIES.map((cat) => ({
    key: cat.key,
    label: cat.label,
    amount: concerts.reduce((sum, c) => sum + Number(c[cat.key] || 0), 0),
  }));

  const grandTotal = totals.reduce((sum, row) => sum + row.amount, 0);

  const categories = totals
    .filter((row) => row.amount > 0)
    .map((row) => ({
      ...row,
      amount: Number(row.amount.toFixed(2)),
      percent: grandTotal > 0 ? (row.amount / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { categories, grandTotal: Number(grandTotal.toFixed(2)) };
}

export function formatPercent(value: number): string {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

export { formatCurrency };
