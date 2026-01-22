# PostgreSQL Migration Guide

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project (workshops)
3. Click **Storage** tab in the top menu
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., "workshop-db")
7. Select region closest to you
8. Click **Create**

Vercel will automatically add these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← Use this one for DATABASE_URL
- `POSTGRES_URL_NON_POOLING`

## Step 2: Update Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. **Update** `DATABASE_URL`:
   - Delete the old SQLite value (`file:./dev.db`)
   - Set to use `POSTGRES_PRISMA_URL` reference: `$POSTGRES_PRISMA_URL`
   - Or copy the actual connection string from the Postgres database page

3. **Verify** `AUTH_SECRET` is set (you added this already ✅)

4. **Set** `AUTH_URL`:
   - Production: `https://your-app-name.vercel.app`
   - Preview: `https://your-preview-url.vercel.app`
   - Development: `http://localhost:3000`

## Step 3: Deploy

The code has been updated and pushed to GitHub. Vercel will:
1. Auto-detect the changes
2. Run database migrations
3. Seed the database with admin user
4. Deploy successfully

**Wait for deployment to complete** (~2-3 minutes)

## Step 4: Verify

After deployment, visit your app:
- Go to: `https://your-app.vercel.app`
- Login with:
  - Email: `admin@meghcomm.store`
  - Password: `admin123456`

## Local Development (Optional)

If you want to test PostgreSQL locally:

1. **Option A: Keep using SQLite locally**
   ```bash
   # In .env
   DATABASE_URL="file:./dev.db"
   ```
   Your Docker container will continue using SQLite

2. **Option B: Use local PostgreSQL**
   ```bash
   # Install PostgreSQL locally, then:
   DATABASE_URL="postgresql://user:password@localhost:5432/workshop"
   ```

## Troubleshooting

### If deployment fails:
1. Check Vercel deployment logs
2. Ensure `DATABASE_URL` is set to `$POSTGRES_PRISMA_URL`
3. Verify Postgres database is created and active

### If login still doesn't work:
1. Visit `/api/seed` to manually seed the database
2. Check `/api/health` to verify database connection

## What Changed

- ✅ Prisma schema now uses PostgreSQL
- ✅ Compatible with Vercel serverless infrastructure
- ✅ Database will persist across deployments
- ✅ Auto-migration and seeding configured
