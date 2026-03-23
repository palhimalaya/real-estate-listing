import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ListingsService', () => {
  let service: ListingsService;
  let prismaService: {
    listing: {
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      listing: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('coerces numeric query params before calling Prisma', async () => {
    prismaService.listing.findMany.mockResolvedValue([]);
    prismaService.listing.count.mockResolvedValue(0);

    await service.findAll(
      {
        page: '2' as unknown as number,
        limit: '10' as unknown as number,
        price_min: '100000' as unknown as number,
        price_max: '500000' as unknown as number,
        beds: '3' as unknown as number,
        baths: '2' as unknown as number,
      },
      false,
    );

    expect(prismaService.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
        where: expect.objectContaining({
          status: 'ACTIVE',
          price: { gte: 100000, lte: 500000 },
          beds: 3,
          baths: 2,
        }),
        select: expect.objectContaining({
          internalNotes: false,
        }),
      }),
    );
  });

  it('includes internal notes in admin detail queries only', async () => {
    prismaService.listing.findUnique.mockResolvedValue(null);

    await service.findById('listing-1', true);

    expect(prismaService.listing.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          internalNotes: true,
        }),
      }),
    );
  });
});
