import type { Concert, CostBreakdown } from "./types";

export function getTotalCost(costs: CostBreakdown): number {
  return (
    Number(costs.ticket_cost || 0) +
    Number(costs.ticket_fees || 0) +
    Number(costs.parking_cost || 0) +
    Number(costs.food_drink_cost || 0) +
    Number(costs.merchandise_cost || 0) +
    Number(costs.lodging_cost || 0) +
    Number(costs.travel_cost || 0) +
    Number(costs.other_cost || 0)
  );
}

export function getCostPerHour(totalCost: number, hours: number): number | null {
  if (!hours || hours <= 0) return null;
  return totalCost / hours;
}

/** Fun Points per $100 = (fun rating / total cost) * 100 */
export function getFunPointsPer100(
  funRating: number,
  totalCost: number,
): number | null {
  if (!totalCost || totalCost <= 0) return null;
  return (funRating / totalCost) * 100;
}

export function withConcertMetrics(concert: Concert) {
  const totalCost = getTotalCost(concert);
  const costPerHour = getCostPerHour(totalCost, Number(concert.hours_at_event));
  const funPointsPer100 = getFunPointsPer100(
    Number(concert.fun_rating),
    totalCost,
  );

  return {
    ...concert,
    totalCost,
    costPerHour,
    funPointsPer100,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
