"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pending?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  pending = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems: Array<number | string> = [];

  for (let current = 1; current <= totalPages; current += 1) {
    const isBoundaryPage = current === 1 || current === totalPages;
    const isNearCurrentPage = Math.abs(current - page) <= 1;

    if (isBoundaryPage || isNearCurrentPage) {
      pageItems.push(current);
      continue;
    }

    const lastItem = pageItems[pageItems.length - 1];
    if (lastItem !== "...") {
      pageItems.push("...");
    }
  }

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1 || pending}
        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {pageItems.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-zinc-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            disabled={pending}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
              item === page
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages || pending}
        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
