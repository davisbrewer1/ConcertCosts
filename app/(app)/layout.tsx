import { AppNav } from "@/components/AppNav";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeSelector } from "@/components/ThemeSelector";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="card bg-base-100 shadow-md border border-base-300 mb-6">
          <div className="card-body gap-4 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-1">
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                  Concert Cost Tracker
                </h1>
                <p className="opacity-70 max-w-xl">
                  Track what you spend on live music — and which shows give you
                  the most fun for your money.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="badge badge-outline badge-lg h-auto py-2 px-3 font-normal max-w-full truncate">
                  {user.email}
                </div>
                <ThemeSelector />
                <LogoutButton />
              </div>
            </div>

            <AppNav />
          </div>
        </header>

        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
}
