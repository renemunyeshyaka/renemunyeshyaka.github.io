#!/bin/bash
# Database migration script for Kcoders Portal
# Usage: ./migrate.sh
# Runs all .sql migration files from the project-root migrations/ directory.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/../migrations"
DB_NAME="${DB_NAME:-kcoders_portal}"
DB_USER="${DB_USER:-kcoders}"

echo "[$(date)] Running migrations from $MIGRATIONS_DIR ..."

for f in "$MIGRATIONS_DIR"/*.sql; do
    [ -f "$f" ] || continue
    echo "[$(date)] Applying migration: $(basename "$f")"
    psql -U "$DB_USER" -d "$DB_NAME" -f "$f"
    echo "[$(date)] Applied: $(basename "$f")"
done

echo "[$(date)] All migrations applied successfully."
