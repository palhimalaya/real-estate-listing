import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
  eagerImage?: boolean;
}

export default function ListingCard({
  listing,
  eagerImage = false,
}: ListingCardProps) {
  const imageUrl = listing.imageUrls[0];
  const formattedPrice = new Intl.NumberFormat("en-US").format(listing.price);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-4xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-64 overflow-hidden bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
            priority={eagerImage}
            loading={eagerImage ? "eager" : "lazy"}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No image available
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize tracking-wide text-zinc-700 shadow-sm backdrop-blur">
          {listing.propertyType}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <p className="text-2xl font-semibold tracking-tight text-zinc-950">
          NPR {formattedPrice}
        </p>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
            {listing.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {listing.beds} Beds · {listing.baths} Baths
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-zinc-600">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate font-medium text-zinc-700">{listing.address}, {listing.suburb}</span>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            {listing.status}
          </span>
        </div>
        {listing.internalNotes && (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              Internal Note
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-700">
              {listing.internalNotes}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
