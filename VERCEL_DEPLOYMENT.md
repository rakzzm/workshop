# Vercel Deployment Configuration

## Required Environment Variables

You need to add these environment variables to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

### Required Variables

| Variable Name | Value | Environment |
|--------------|--------|-------------|
| `DATABASE_URL` | `file:./dev.db` | Production, Preview, Development |
| `AUTH_SECRET` | `<generate-random-secret>` | Production, Preview, Development |
| `AUTH_URL` | `https://your-app.vercel.app` | Production |
| `AUTH_URL` | `https://your-preview-url.vercel.app` | Preview |
| `AUTH_URL` | `http://localhost:3000` | Development |

### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

## Vercel Build Settings

Ensure the following build settings in your Vercel project:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Notes

- SQLite (`file:./dev.db`) works on Vercel but the database resets on each deployment
- For persistent data, consider upgrading to PostgreSQL (Vercel Postgres)
- The build script handles Prisma generation and seeding automatically
