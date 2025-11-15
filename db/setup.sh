#!/bin/bash
set -e

# Check if running in Docker
if [ -f /.dockerenv ] || [ -n "$DOCKER_CONTAINER" ]; then
  DB_HOST="${DB_HOST:-db}"
  DB_PORT="${DB_PORT:-5432}"
else
  DB_HOST="${DB_HOST:-localhost}"
  DB_PORT="${DB_PORT:-5432}"
fi

export PGHOST="$DB_HOST"
export PGPORT="$DB_PORT"

echo "Setting up database..."

# Execute install.sql
psql -f install.sql -U postgres -h "$DB_HOST" -p "$DB_PORT"

# Execute structure.sql
PGPASSWORD=marcus psql -d example -f structure.sql -U marcus -h "$DB_HOST" -p "$DB_PORT"

# Execute data.sql
PGPASSWORD=marcus psql -d example -f data.sql -U marcus -h "$DB_HOST" -p "$DB_PORT"

echo "Database setup completed!"
