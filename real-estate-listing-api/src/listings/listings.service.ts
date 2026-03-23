import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingsQueryDto } from './dto/listings-query-dto';
import { ListingResults } from './types/listing-response.type';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  private getListingSelect(isAdmin: boolean) {
    return {
      id: true,
      title: true,
      description: true,
      price: true,
      beds: true,
      baths: true,
      propertyType: true,
      suburb: true,
      address: true,
      imageUrls: true,
      createdAt: true,
      status: true,
      internalNotes: isAdmin,
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    };
  }

  private toPositiveInt(value: unknown, fallback: number): number {
    const parsed =
      typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private toNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  async findAll(query: ListingsQueryDto, isAdmin: boolean): Promise<ListingResults> {
    const page = this.toPositiveInt(query.page, 1);
    const limit = this.toPositiveInt(query.limit, 10);
    const skip = (page - 1) * limit;
    const priceMin = this.toNumber(query.price_min);
    const priceMax = this.toNumber(query.price_max);
    const beds = this.toNumber(query.beds);
    const baths = this.toNumber(query.baths);

    const where: any = {};

    if (!isAdmin) {
      where.status = 'ACTIVE';
    }

    if (priceMin !== undefined) where.price = { gte: priceMin };
    if (priceMax !== undefined) {
      where.price = { ...where.price, lte: priceMax };
    }
    if (beds !== undefined) where.beds = beds;
    if (baths !== undefined) where.baths = baths;
    if (query.propertyType) where.propertyType = query.propertyType;
    if (query.suburb) where.suburb = query.suburb;
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword, mode: 'insensitive' } },
        { description: { contains: query.keyword, mode: 'insensitive' } },
        { address: { contains: query.keyword, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (query.sort === 'price_asc') orderBy.price = 'asc';
    else if (query.sort === 'price_desc') orderBy.price = 'desc';
    else orderBy.createdAt = 'desc';

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: this.getListingSelect(isAdmin),
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, isAdmin: boolean) {
    const where: any = { id };
    if (!isAdmin) {
      where.status = 'ACTIVE';
    }

    return this.prisma.listing.findUnique({
      where,
      select: this.getListingSelect(isAdmin),
    });
  }
}
