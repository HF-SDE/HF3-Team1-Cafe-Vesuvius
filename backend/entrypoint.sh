#!/bin/sh
# no verbose
set +x
# Automatic deploy to prod database
npx prisma db push

# Go forward
exec "$@"