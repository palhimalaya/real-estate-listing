import { PrismaClient, ListingStatus } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/config/env';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.listing.deleteMany();
  await prisma.agent.deleteMany();

  const suburbs = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];
  const areas = [
    'Baneshwor',
    'Jhamsikhel',
    'Suryabinayak',
    'Thamel',
    'Kalanki',
  ];
  const propertyTypes = ['apartment', 'villa', 'room'];

  const listingsData = Array.from({ length: 25 }).map((_, i) => ({
    title: `Property ${i + 1}`,
    description: `Nice property number ${i + 1}`,
    price: 100000 + i * 50000,
    beds: (i % 5) + 1,
    baths: (i % 3) + 1,
    propertyType: propertyTypes[i % propertyTypes.length],
    suburb: suburbs[i % suburbs.length],
    address: areas[i % areas.length],
    status: i % 4 === 0 ? ListingStatus.DRAFT : ListingStatus.ACTIVE,
    internalNotes: `Internal note ${i + 1}`,
    imageUrls: [
      `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2`,
      `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688`,
    ],
  }));

  await prisma.agent.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9800000000',
      listings: {
        create: listingsData,
      },
    },
  });
}

main()
  .then(() => {
    console.log('🌱 Seeding complete');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
