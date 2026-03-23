"use client";

import { useState } from "react";
import { ListingQueryParams } from "@/lib/listings";

export interface ListingFilterFormValues {
  price_min: string;
  price_max: string;
  beds: string;
  baths: string;
  propertyType: string;
  suburb: string;
  keyword: string;
  sort: NonNullable<ListingQueryParams["sort"]>;
}

interface ListingsFilterBarProps {
  initialValues: ListingFilterFormValues;
  pending?: boolean;
  onSubmit: (values: ListingFilterFormValues) => void;
}

const fieldClassName =
  "h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-0";

export default function ListingsFilterBar({
  initialValues,
  pending = false,
  onSubmit,
}: ListingsFilterBarProps) {
  const [values, setValues] = useState(initialValues);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-zinc-950">Filters</p>
          <p className="mt-1 text-sm text-zinc-500">
            Refine by price, bedrooms, location, and sort order.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setValues(initialValues);
              onSubmit({
                ...initialValues,
                price_min: "",
                price_max: "",
                beds: "",
                baths: "",
                propertyType: "",
                suburb: "",
                keyword: "",
                sort: "latest",
              });
            }}
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Updating..." : "Apply Filters"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Min Price
          </span>
          <input
            type="number"
            value={values.price_min}
            onChange={(event) =>
              setValues((current) => ({ ...current, price_min: event.target.value }))
            }
            placeholder="500000"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Max Price
          </span>
          <input
            type="number"
            value={values.price_max}
            onChange={(event) =>
              setValues((current) => ({ ...current, price_max: event.target.value }))
            }
            placeholder="2500000"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Beds
          </span>
          <select
            value={values.beds}
            onChange={(event) =>
              setValues((current) => ({ ...current, beds: event.target.value }))
            }
            className={fieldClassName}
          >
            <option value="">Any</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
            <option value="5">5 Beds</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Baths
          </span>
          <select
            value={values.baths}
            onChange={(event) =>
              setValues((current) => ({ ...current, baths: event.target.value }))
            }
            className={fieldClassName}
          >
            <option value="">Any</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3 Baths</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Property Type
          </span>
          <select
            value={values.propertyType}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                propertyType: event.target.value,
              }))
            }
            className={fieldClassName}
          >
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="room">Room</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Suburb
          </span>
          <input
            type="text"
            value={values.suburb}
            onChange={(event) =>
              setValues((current) => ({ ...current, suburb: event.target.value }))
            }
            placeholder="Kathmandu"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Keyword
          </span>
          <input
            type="text"
            value={values.keyword}
            onChange={(event) =>
              setValues((current) => ({ ...current, keyword: event.target.value }))
            }
            placeholder="garden, balcony, bright"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Sort
          </span>
          <select
            value={values.sort}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                sort: event.target.value as ListingFilterFormValues["sort"],
              }))
            }
            className={fieldClassName}
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price Low to High</option>
            <option value="price_desc">Price High to Low</option>
          </select>
        </label>
      </div>
    </form>
  );
}
