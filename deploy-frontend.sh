#!/bin/sh

set -e

# first 7 characters of the current commit hash
IMAGE_TAG=$(git rev-parse --short HEAD)

echo "Initialising Frontend..."

echo "Using ENVs:"
echo "— NODE_ENV: ${NODE_ENV}"
echo "— LOCATION: ${LOCATION}" # LOCATION: europe-west2
echo "— DOMAIN_NAME: ${DOMAIN_NAME}" # SERVER_IMAGE_NAME
echo "— PROJECT_NAME: ${PROJECT_NAME}" # PROJECT_NAME
echo "— NEXT_PUBLIC_SERVER_URL: ${NEXT_PUBLIC_SERVER_URL}" # MONGO_URI

echo "Building Frontend Image ${DOMAIN_NAME}-frontend:${IMAGE_TAG}, and tagging as latest..."
docker build  -f ./frontend/Dockerfile -t "${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:${IMAGE_TAG}" --build-arg NODE_ENV="${NODE_ENV}" --build-arg NEXT_PUBLIC_SERVER_URL="${NEXT_PUBLIC_SERVER_URL}" ./frontend
docker push "${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:${IMAGE_TAG}"

docker tag "${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:${IMAGE_TAG}" "${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:latest"
docker push "${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:latest"
echo "Building Frontend Image ${DOMAIN_NAME}-frontend with tag ${IMAGE_TAG} completed..."
