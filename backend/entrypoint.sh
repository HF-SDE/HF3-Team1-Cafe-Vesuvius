#!/bin/sh
# no verbose
set +x
# Automatic deploy to prod database
npx prisma migrate deploy

# Go forward
exec "$@"