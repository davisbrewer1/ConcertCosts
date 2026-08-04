import { ConcertForm } from "@/components/ConcertForm";

export default function AddConcertPage() {
  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h2 className="font-display text-2xl font-bold">Add Concert</h2>
        <p className="opacity-70">
          Fill in the show details, costs, and fun rating. Total cost updates as
          you type.
        </p>
      </div>
      <ConcertForm />
    </div>
  );
}
