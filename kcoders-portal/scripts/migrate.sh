#!/bin/bash
# Database migration script for Kcoders LMS
# Usage: ./migrate.sh

set -e

DB_NAME="kcoders_portal"
DB_USER="kcoders"

echo "[$(date)] Running migrations..."

for f in ../backend/migrations/*.sql; do
    echo "[$(date)] Applying migration: $f"
    psql -U "$DB_USER" -d "$DB_NAME" -f "$f"
    echo "[$(date)] Migration applied: $f"
done

echo "[$(date)] All migrations applied successfully."
