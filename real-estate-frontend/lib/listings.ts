import { buildNestPublicUrl } from "./nest-client";
import type { Listing } from "@/types/listing";

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingQueryParams {
  page?: number;
  limit?: number;
  price_min?: string | number;
  price_max?: string | number;
  beds?: string | number;
  baths?: string | number;
  propertyType?: string;
  suburb?: string;
  keyword?: string;
  sort?: "latest" | "price_asc" | "price_desc";
}

interface RequestOptions {
  isAdmin?: boolean;
}

function buildRequestHeaders(isAdmin?: boolean): HeadersInit | undefined {
  if (!isAdmin) {
    return undefined;
  }

  return {
    "x-admin": "true",
  };
}

export async function getListings(
  query: ListingQueryParams = {},
  options: RequestOptions = {},
): Promise<ListingsResponse> {
  const { page = 1, limit = 9, ...filters } = query;
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });
  }

  const url = buildNestPublicUrl("/listings", searchParams);
  const res = await fetch(url, {
    headers: buildRequestHeaders(options.isAdmin),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }

  return res.json();
}

export async function getListingById(
  id: string,
  options: RequestOptions = {},
): Promise<Listing> {
  const url = buildNestPublicUrl(`/listings/${id}`);
  const res = await fetch(url, {
    headers: buildRequestHeaders(options.isAdmin),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }

  return res.json();
}
