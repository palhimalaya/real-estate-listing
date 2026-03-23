export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  propertyType: string;
  suburb: string;
  address: string;
  imageUrls: string[];
  status: "DRAFT" | "ACTIVE" | "SOLD" | "ARCHIVED";
  createdAt: string;
  internalNotes?: string | null;
  agent?: Agent;
}
