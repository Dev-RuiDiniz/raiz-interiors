# RAIZ Interiors

Website built with Next.js 16, Prisma and React 19.

## Requirements

- Node.js 22+
- pnpm 10+
- PostgreSQL

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Production build

```bash
pnpm build
```

## Type check

```bash
pnpm typecheck
```

## Environment variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY="..."
APIFY_API_TOKEN="" # optional unless using /api/instagram/sync
```

### Contact form notes

- The contact form sends email through **Web3Forms** from the browser.
- Configure `info@raiz-interiors.com` as the notification inbox in the Web3Forms dashboard.
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is required for the form to submit successfully.
- `.env.local` must stay out of git.
- The API route still stores contact submissions in the database when Prisma is configured.

## Deploy

Ready for deployment on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WBianchi/raiz-interiors&root-directory=Deploy)

This repository uses `Deploy/` as the official Vercel root directory. Build and deployment settings must point to that folder.

## Notes

- Keep `.env.local` out of git.
- The frontend shows validation and delivery feedback without changing the page layout.
