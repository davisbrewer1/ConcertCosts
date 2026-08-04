import { EmptyState } from "@/components/EmptyState";
import { SpendingCharts } from "@/components/SpendingCharts";
import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

export default async function MySpendingPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: true });

  const concerts = (data ?? []) as Concert[];

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold">My Spending</h2>
        <p className="opacity-70">
          See how your concert spending changes over time — and which cost
          categories take the biggest share.
        </p>
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>Could not load spending: {error.message}</span>
        </div>
      )}

      {!error && concerts.length === 0 && (
        <EmptyState
          title="No spending to show yet"
          message="No concerts logged yet. Add your first concert to start seeing your spending charts."
        />
      )}

      {!error && concerts.length > 0 && <SpendingCharts concerts={concerts} />}
    </div>
  );
}
