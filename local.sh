#!/bin/sh

set -e

echo "Local run..."

DOMAIN_NAME=dubliz.store \
REACT_APP_PROTOCOL=https \
REACT_APP_WS_PROTOCOL=wss \
LOCATION=europe-west2 \
PROJECT_NAME=dubliz \
REACT_APP_SERVER_ORIGIN=epic.ms/api \
NODE_ENV=production \
NEXT_PUBLIC_SERVER_URL=dubliz.store \
docker compose -f docker-compose.local.yml up -d
