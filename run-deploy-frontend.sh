#!/bin/sh

set -e

echo "Starting Deploy Frontend..."

source ./setup.sh

echo "Deploy Frontend: OK."

scp -o "StrictHostKeyChecking no" -i ssh_key ./docker-compose.frontend-"${NODE_ENV}".yml "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"

sudo chmod +x ./deploy-frontend.sh \
&& env NODE_ENV="${NODE_ENV}" \
LOCATION="${LOCATION}" \
DOMAIN_NAME="${DOMAIN_NAME}" \
MONGO_URI="${MONGO_URI}" \
PROJECT_NAME="${PROJECT_NAME}" \
sh ./deploy-frontend.sh

ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no"  \
"export NODE_ENV='${NODE_ENV}' && \
export LOCATION='${LOCATION}' && \
export PROJECT_NAME='${PROJECT_NAME}' && \
export DOMAIN_NAME='${DOMAIN_NAME}' && \
export MONGO_URI='${MONGO_URI}' && \
export NEXT_PUBLIC_FRONT_END_ENV='${NODE_ENV}' && \
export NEXT_PUBLIC_PROTOCOL='https' && \
gcloud auth configure-docker '${LOCATION}-docker.pkg.dev' --quiet && \
docker pull '${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:latest' && \
NODE_ENV='${NODE_ENV}' \
LOCATION='${LOCATION}' \
PROJECT_NAME='${PROJECT_NAME}' \
DOMAIN_NAME='${DOMAIN_NAME}' \
MONGO_URI='${MONGO_URI}' \
NEXT_PUBLIC_PROTOCOL='https' \
NEXT_PUBLIC_FRONT_END_ENV='${NODE_ENV}' \
docker compose -f docker-compose.frontend-prod.yml up -d"

echo "Frontend Configuration is Done!"