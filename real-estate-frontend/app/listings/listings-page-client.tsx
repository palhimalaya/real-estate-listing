"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getListings, type ListingQueryParams } from "@/lib/listings";
import { Listing } from "@/types/listing";
import ListingCardSkeleton from "@/components/listing-card-skeleton";
import ListingCard from "@/components/listing-card";
import ListingsFilterBar, {
  type ListingFilterFormValues,
} from "@/components/listings-filter-bar";
import Pagination from "@/components/pagination";
import { useAdminMode } from "@/lib/admin-mode";

const PAGE_SIZE = 9;

type SearchParamsLike = Pick<URLSearchParams, "get">;

function getPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getFiltersFromSearchParams(searchParams: SearchParamsLike) {
  return {
    price_min: searchParams.get("price_min") ?? "",
    price_max: searchParams.get("price_max") ?? "",
    beds: searchParams.get("beds") ?? "",
    baths: searchParams.get("baths") ?? "",
    propertyType: searchParams.get("propertyType") ?? "",
    suburb: searchParams.get("suburb") ?? "",
    keyword: searchParams.get("keyword") ?? "",
    sort: (searchParams.get("sort") as ListingFilterFormValues["sort"]) ?? "latest",
  };
}

function buildSearchParams(filters: ListingFilterFormValues, page: number) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (filters.sort !== "latest") {
    params.set("sort", filters.sort);
  }

  (Object.entries(filters) as Array<[keyof ListingFilterFormValues, string]>).forEach(
    ([key, value]) => {
      if (key === "sort") {
        return;
      }

      const trimmedValue = value.trim();
      if (trimmedValue) {
        params.set(key, trimmedValue);
      }
    },
  );

  return params;
}

function buildListingQueryParams(filters: ListingFilterFormValues, page: number): ListingQueryParams {
  const params: ListingQueryParams = {
    page,
    limit: PAGE_SIZE,
  };

  if (filters.price_min) params.price_min = filters.price_min;
  if (filters.price_max) params.price_max = filters.price_max;
  if (filters.beds) params.beds = filters.beds;
  if (filters.baths) params.baths = filters.baths;
  if (filters.propertyType) params.propertyType = filters.propertyType;
  if (filters.suburb) params.suburb = filters.suburb;
  if (filters.keyword) params.keyword = filters.keyword;
  if (filters.sort !== "latest") params.sort = filters.sort;

  return params;
}

export default function ListingsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAdmin } = useAdminMode();
  const [isPending, startPageTransition] = useTransition();
  const [resultsState, setResultsState] = useState<{
    listings: Listing[];
    total: number;
    totalPages: number;
    error: string | null;
    loadedKey: string;
  }>({
    listings: [],
    total: 0,
    totalPages: 1,
    error: null,
    loadedKey: "",
  });

  const currentPage = getPositiveInt(searchParams.get("page"), 1);
  const activeFilters = getFiltersFromSearchParams(searchParams);
  const searchKey = searchParams.toString();
  const requestKey = `${searchKey}|admin:${isAdmin}`;

  useEffect(() => {
    let isMounted = true;

    getListings(buildListingQueryParams(activeFilters, currentPage), { isAdmin })
      .then((res) => {
        if (!isMounted) {
          return;
        }

        setResultsState({
          listings: res.listings,
          total: res.total,
          totalPages: Math.max(1, res.totalPages),
          error: null,
          loadedKey: requestKey,
        });
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        setResultsState({
          listings: [],
          total: 0,
          totalPages: 1,
          error: err.message,
          loadedKey: requestKey,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilters, currentPage, isAdmin, requestKey]);

  const pushFiltersToUrl = (nextFilters: ListingFilterFormValues, page: number) => {
    const nextSearchParams = buildSearchParams(nextFilters, page);
    const nextUrl = nextSearchParams.toString()
      ? `${pathname}?${nextSearchParams.toString()}`
      : pathname;

    startPageTransition(() => {
      router.push(nextUrl, { scroll: false });
    });
  };

  const loading = resultsState.loadedKey !== requestKey;
  const error = resultsState.loadedKey === requestKey ? resultsState.error : null;
  const total = resultsState.loadedKey === requestKey ? resultsState.total : 0;
  const totalPages =
    resultsState.loadedKey === requestKey ? resultsState.totalPages : 1;
  const listings =
    resultsState.loadedKey === requestKey ? resultsState.listings : [];

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-red-600">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 shadow-sm">
              Listings
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Find a place that fits how you actually live.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                Refine by price, layout, property type, and suburb. Search state stays in
                the URL so results are easy to refresh or share.
              </p>
            </div>
          </div>
          <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 shadow-sm">
            {loading ? "Loading properties..." : `${total} properties found`}
          </div>
        </div>

        <ListingsFilterBar
          key={searchKey}
          initialValues={activeFilters}
          pending={isPending}
          onSubmit={(nextFilters) => pushFiltersToUrl(nextFilters, 1)}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              No listings found
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Try widening your price range or clearing one of the filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                eagerImage={index === 0}
              />
            ))}
          </div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          pending={isPending}
          onPageChange={(nextPage) => pushFiltersToUrl(activeFilters, nextPage)}
        />
      </section>
    </main>
  );
}
