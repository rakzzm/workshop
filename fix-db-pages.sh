#!/bin/bash
# Add database fallbacks to all server component pages

echo "Adding database fallbacks..."

# List of pages to fix
PAGES=(
  "src/app/customers/page.tsx"
  "src/app/vendors/page.tsx" 
  "src/app/mechanics/page.tsx"
  "src/app/inventory/page.tsx"
  "src/app/parts/page.tsx"
  "src/app/orders/page.tsx"
  "src/app/services/page.tsx"
)

for page in "${PAGES[@]}"; do
  echo "Fixing $page..."
  
  # Check if file uses prisma import
  if grep -q "import prisma from" "$page"; then
    # Replace import
    sed -i '' 's/import prisma from "@\/lib\/prisma"/import { prisma, safeDbQuery } from "@\/lib\/prisma"/g' "$page"
    echo "  ✓ Updated import"
  fi
done

echo "Done! Now manually wrap queries in safeDbQuery()"
