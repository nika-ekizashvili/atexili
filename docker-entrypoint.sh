#!/bin/sh
# Apply pending DB migrations before the app starts. Set SEED_ON_START=true to
# also load the demo dataset (safe to run once against an empty DB).
set -e

echo "→ prisma migrate deploy"
./node_modules/.bin/prisma migrate deploy

if [ "$SEED_ON_START" = "true" ]; then
  echo "→ seeding demo data"
  node prisma/seed.mjs
fi

echo "→ starting server"
exec "$@"
