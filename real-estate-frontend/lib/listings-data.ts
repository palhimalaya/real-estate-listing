import { Listing } from "./listings";

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Beautiful Apartment in Thamel",
    description: "Spacious 2-bedroom apartment with modern amenities",
    price: 150000,
    beds: 2,
    baths: 1,
    propertyType: "apartment",
    suburb: "Kathmandu",
    address: "Thamel",
    imageUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    ],
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
];
