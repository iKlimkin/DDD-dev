#!/bin/bash
set -e

echo "Initializing database..."

# Execute install.sql (creates user and database)
psql -f /db/install.sql -U postgres

# Execute structure.sql in example database
PGPASSWORD=marcus psql -d example -f /db/structure.sql -U marcus

# Execute data.sql in example database
PGPASSWORD=marcus psql -d example -f /db/data.sql -U marcus

echo "Database initialization completed!"
