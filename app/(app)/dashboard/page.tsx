import { DashboardCharts } from "@/components/DashboardCharts";
import { DashboardStats } from "@/components/DashboardStats";
import { EmptyState } from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: true });

  const concerts = (data ?? []) as Concert[];

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold">Dashboard</h2>
        <p className="opacity-70">
          A clear picture of your concert spending and fun scores.
        </p>
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>Could not load dashboard: {error.message}</span>
        </div>
      )}

      {!error && concerts.length === 0 && <EmptyState />}

      {!error && concerts.length > 0 && (
        <>
          <DashboardStats concerts={concerts} />
          <DashboardCharts concerts={concerts} />
        </>
      )}
    </div>
  );
}
