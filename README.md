# Real Estate App (Frontend + API)

Monorepo with:
- `real-estate-listing-api` (NestJS + Prisma + PostgreSQL)
- `real-estate-frontend` (Next.js)

## 1) How to Run the App

### Prerequisites
- Node.js 20+
- npm
- PostgreSQL running locally or remotely

### A. Start the API

```bash
cd real-estate-listing-api
npm install
```

Create `.env` in `real-estate-listing-api`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/real_estate"
JWT_SECRET="dev-secret"
PORT=3001
FRONTEND_ORIGIN="http://localhost:3000"
```

Run migrations and start API:

```bash
npx prisma migrate dev
npm run start:dev
```

Note: `npx prisma migrate dev` runs Prisma Client generation by default.

API base URL: `http://localhost:3001`

### B. Start the Frontend

Open a new terminal:

```bash
cd real-estate-frontend
npm install
npm run dev
```

Optional `.env.local` in `real-estate-frontend` (only if backend is not on default port):

```env
NEXT_PUBLIC_BACKEND_API_BASE_URL="http://localhost:3001"
```

Frontend URL: `http://localhost:3000`

## 2) How to Seed the DB

From `real-estate-listing-api`:

```bash
# Applies migrations and creates schema
npx prisma migrate dev

# Seed sample data (25 listings + 1 agent)
npx prisma db seed
```

If you ever need to regenerate manually, run: `npx prisma generate`

## 3) Example API Calls

Base URL: `http://localhost:3001`

```bash
# Get paginated listings
curl "http://localhost:3001/listings?page=1&limit=5"

# Filter listings
curl "http://localhost:3001/listings?price_min=100000&price_max=300000&beds=2&sort=price_asc"

# Admin view (includes draft listings)
curl -H "x-admin: true" "http://localhost:3001/listings?page=1&limit=10"

# Get one listing by ID
curl "http://localhost:3001/listings/<listing-id>"
```
