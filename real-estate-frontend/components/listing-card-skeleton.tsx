export default function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
      <div className="h-64 animate-pulse bg-zinc-200" />
      <div className="space-y-3 p-5">
        <div className="h-7 w-32 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}
