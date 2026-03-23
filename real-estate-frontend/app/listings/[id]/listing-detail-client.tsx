"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getListingById } from "@/lib/listings";
import { Listing } from "@/types/listing";
import { useAdminMode } from "@/lib/admin-mode";

export default function ListingDetailClient({ listingId }: { listingId: string }) {
  const { isAdmin } = useAdminMode();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [detailState, setDetailState] = useState<{
    listing: Listing | null;
    error: string | null;
    loadedKey: string;
  }>({
    listing: null,
    error: null,
    loadedKey: "",
  });
  const requestKey = `${listingId}|admin:${isAdmin}`;

  useEffect(() => {
    if (!listingId) return;

    let isMounted = true;

    getListingById(listingId, { isAdmin })
      .then((res) => {
        if (!isMounted) {
          return;
        }

        setDetailState({
          listing: res,
          error: null,
          loadedKey: requestKey,
        });
        setSelectedImageIndex(0);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        setDetailState({
          listing: null,
          error: err.message,
          loadedKey: requestKey,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [listingId, isAdmin, requestKey]);

  const loading = detailState.loadedKey !== requestKey;
  const error = detailState.loadedKey === requestKey ? detailState.error : null;
  const listing = detailState.loadedKey === requestKey ? detailState.listing : null;

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-red-600">Error: {error}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="h-[420px] animate-pulse bg-zinc-200" />
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className="space-y-4">
              <div className="h-10 w-1/2 animate-pulse rounded bg-zinc-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-zinc-100" />
              <div className="h-28 animate-pulse rounded-3xl bg-zinc-100" />
            </div>
            <div className="h-72 animate-pulse rounded-3xl bg-zinc-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center shadow-sm">
          Listing not found.
        </div>
      </main>
    );
  }

  const galleryImages = listing.imageUrls.length > 0 ? listing.imageUrls : [];
  const activeImage = galleryImages[selectedImageIndex];
  const formattedPrice = new Intl.NumberFormat("en-US").format(listing.price);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <Link
          href="/listings"
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          ← Back to Listings
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[2rem] bg-zinc-100">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={listing.title}
                    width={1600}
                    height={1040}
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                  />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-sm text-zinc-400 sm:h-[420px] lg:h-[520px]">
                    No image available
                  </div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {galleryImages.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`overflow-hidden rounded-2xl border transition ${
                        index === selectedImageIndex
                          ? "border-zinc-900 shadow-sm"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${listing.title} view ${index + 1}`}
                        width={240}
                        height={160}
                        sizes="160px"
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                      {listing.propertyType}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                      {listing.status}
                    </span>
                    {isAdmin && (
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white">
                        Admin View
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                    {listing.title}
                  </h1>
                  <p className="text-sm text-zinc-500">{listing.address}, {listing.suburb}</p>
                </div>

                <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Description
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
                    {listing.description}
                  </p>
                </div>

                {isAdmin && listing.internalNotes && (
                  <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                      Internal Notes
                    </p>
                    <p className="mt-3 text-sm leading-7 text-zinc-200 sm:text-base">
                      {listing.internalNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Price
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  NPR {formattedPrice}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Beds</p>
                    <p className="mt-2 text-xl font-semibold text-zinc-950">{listing.beds}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Baths</p>
                    <p className="mt-2 text-xl font-semibold text-zinc-950">{listing.baths}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Property Details
                </p>
                <dl className="mt-4 space-y-4 text-sm text-zinc-600">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-500">Address</dt>
                    <dd className="text-right font-medium text-zinc-900">
                      {listing.address}, {listing.suburb}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-500">Property Type</dt>
                    <dd className="font-medium capitalize text-zinc-900">
                      {listing.propertyType}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-zinc-500">Status</dt>
                    <dd className="font-medium uppercase text-zinc-900">{listing.status}</dd>
                  </div>
                </dl>
              </div>

              {listing.agent && (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Agent
                  </p>
                  <div className="mt-4 space-y-3">
                    <p className="text-xl font-semibold tracking-tight text-zinc-950">
                      {listing.agent.name}
                    </p>
                    <a
                      href={`mailto:${listing.agent.email}`}
                      className="block text-sm text-zinc-600 transition hover:text-zinc-950"
                    >
                      {listing.agent.email}
                    </a>
                    <a
                      href={`tel:${listing.agent.phone}`}
                      className="block text-sm text-zinc-600 transition hover:text-zinc-950"
                    >
                      {listing.agent.phone}
                    </a>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
