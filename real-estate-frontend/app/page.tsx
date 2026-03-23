import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500">Real Estate Listings</p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Frontend for browsing property listings from the API.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Use the listings page to filter by price, beds, baths, property type,
              suburb, and keyword. Open any item to view the full listing details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/listings"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Open listings
            </Link>
            <span className="text-sm text-zinc-500">
              Admin mode shows internal notes on the detail page.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
