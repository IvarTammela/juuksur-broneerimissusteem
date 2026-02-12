# Juuksurisalongi Broneerimissüsteem

Hair salon booking system with multi-barber support, bilingual interface (Estonian/English), and admin panel.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Prisma ORM** + PostgreSQL
- **Tailwind CSS** + shadcn/ui
- **NextAuth v5** (admin authentication)
- **next-intl** (i18n: Estonian + English)

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 14+

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Create database
createdb juuksur_booking

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

### Default Admin Login

- Email: `admin@juuksur.ee`
- Password: `admin123`

## Features

### Client-Facing
- Multi-step booking wizard (barber -> service -> date/time -> contact info -> confirm)
- Available time slot calculation based on barber schedules, breaks, and existing bookings
- Bilingual interface (Estonian / English)
- Responsive design

### Admin Panel (`/admin`)
- Dashboard with today's appointments and statistics
- Barber management (CRUD, profile, services assignment)
- Service management (CRUD, bilingual names/descriptions)
- Schedule management (weekly hours per barber, breaks)
- Appointment management (list, filter, status updates, notes)
- Salon settings (name, contact, booking parameters)

## Project Structure

```
src/
├── app/
│   ├── [locale]/        # Public pages (ET/EN)
│   ├── admin/           # Admin panel
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── booking/         # Booking wizard components
│   ├── admin/           # Admin panel components
│   └── shared/          # Shared components
├── lib/                 # Utilities, Prisma client, validators
└── i18n/                # Internationalization config
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Deployment

### Docker

```bash
docker compose up -d  # Start PostgreSQL
npm run build         # Build the app
npm start             # Start production server
```

### With Dockerfile

```bash
docker build -t juuksur .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e AUTH_SECRET="your-secret" \
  juuksur
```
