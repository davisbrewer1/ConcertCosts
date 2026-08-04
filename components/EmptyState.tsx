import Link from "next/link";

type EmptyStateProps = {
  title?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title = "No concerts yet",
  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",
  actionHref = "/add-concert",
  actionLabel = "Add Concert",
}: EmptyStateProps) {
  return (
    <div className="card bg-base-200/60 border border-base-300">
      <div className="card-body items-center text-center gap-3 py-12">
        <div className="text-5xl opacity-40" aria-hidden>
          ♪
        </div>
        <h2 className="card-title text-xl">{title}</h2>
        <p className="max-w-md opacity-80">{message}</p>
        {actionHref && (
          <Link href={actionHref} className="btn btn-primary mt-2">
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
