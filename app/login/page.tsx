import { LoginForm } from "@/components/LoginForm";
import { ThemeSelector } from "@/components/ThemeSelector";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-base-300 via-neutral to-primary/40"
        aria-hidden
      />
      <div
        className="hero-glow absolute -top-24 -left-16 h-80 w-80 rounded-full bg-secondary/30 blur-3xl"
        aria-hidden
      />
      <div
        className="hero-glow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-end animate-fade-up">
          <ThemeSelector />
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 text-center sm:py-16">
          <div className="animate-fade-up space-y-4 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.25em] opacity-70">
              Your night out, priced clearly
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-base-content">
              Concert Cost Tracker
            </h1>
            <p className="text-base sm:text-lg opacity-80 max-w-xl mx-auto">
              Log the shows you love, add every cost, rate the fun, and see which
              nights were worth every dollar.
            </p>
          </div>

          <div className="animate-fade-up-delay w-full flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
