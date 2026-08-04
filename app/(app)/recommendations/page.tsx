import { RecommendationsClient } from "@/components/RecommendationsClient";

export default function RecommendationsPage() {
  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold">Concert Recommendations</h2>
        <p className="opacity-70">
          Answer a few questions about where you live and what you like — then
          get real upcoming shows in your travel range.
        </p>
      </div>
      <RecommendationsClient />
    </div>
  );
}
