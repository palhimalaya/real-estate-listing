export class ListingsQueryDto {
  price_min?: number;
  price_max?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  suburb?: string;
  keyword?: string;

  page?: number = 1;
  limit?: number = 10;

  sort?: 'price_asc' | 'price_desc' | 'latest';
}
