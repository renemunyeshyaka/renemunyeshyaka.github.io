#!/bin/bash
# Database backup script for Kcoders LMS
# Usage: ./backup.sh

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../storage/backups"
DB_NAME="kcoders_portal"
DB_USER="kcoders"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting database backup..."

pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump"

echo "[$(date)] Backup created: ${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.dump" -mtime +7 -delete

echo "[$(date)] Old backups cleaned. Done."
