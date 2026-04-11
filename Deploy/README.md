# RAIZ Interiors

> Premium Interior Design Studio Website

A modern, sophisticated website for RAIZ Interiors - a design studio dedicated to creating meaningful spaces that tell your story.

## Features

- **Modern Stack**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Elegant Design**: Minimalist aesthetic with sophisticated typography
- **Fully Responsive**: Optimized for all device sizes
- **Animations**: Smooth transitions with Framer Motion
- **Component Library**: Shadcn/ui + Radix UI
- **Database Ready**: Prisma ORM with PostgreSQL schema
- **Form Validation**: React Hook Form + Zod
- **GDPR Compliant**: Cookie consent banner
- **WhatsApp Integration**: Floating chat widget

## Pages

- **Home** - Hero, featured projects, services preview
- **Projects** - Grid layout with filters + individual project pages
- **Services** - Service offerings + process diagram
- **About** - Studio story, values, Instagram feed
- **Contact** - Contact form with validation

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Shadcn/ui, Radix UI |
| Animations | Framer Motion |
| Database | PostgreSQL + Prisma |
| Validation | Zod |
| Forms | React Hook Form |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

## Deploy

Ready for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WBianchi/raiz-interiors)

---

Developed with care for RAIZ Interiors.
# raiz_interiors_site
## Environment Variables

Use `.env.example` as base:

```bash
cp .env.example .env.local
```

Minimum required values:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
APIFY_API_TOKEN="" # optional unless using /api/instagram/sync
```

Detailed setup and staging strategy: `doc/setup-staging.md`.
