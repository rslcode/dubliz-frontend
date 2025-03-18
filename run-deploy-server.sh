#!/bin/sh

set -e

echo "Starting Deploy server..."

source ./setup.sh

# Deploy Server: OK
 git clone https://"${GIT_USER}":"${GIT_TOKEN}"@github.com/rslcode/epic_cms_server.git
 mv storage_key.json ./epic_cms_server/server
 scp -o "StrictHostKeyChecking no" -i ssh_key ./epic_cms_server/docker* "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
 scp -o "StrictHostKeyChecking no" -i ssh_key gcr_key "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"

 sudo chmod +x ./epic_cms_server/deploy-server.sh \
 && env NODE_ENV="${NODE_ENV}" \
 DOMAIN_NAME="${DOMAIN_NAME}" \
 REGISTRY_NAME="${REGISTRY_NAME}" \
 GCR_KEY="${GCR_KEY}" \
 sh ./epic_cms_server/deploy-server.sh
 
 echo "deploy-server is Done!"
 
 ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
 "cat gcr_key | docker login -u _json_key --password-stdin https://${LOCATION}-docker.pkg.dev \
 && docker pull ${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/server/${DOMAIN_NAME}-server:latest \
 && JWT_SECRET=${JWT_SECRET} \
   PROJECT_NAME=${PROJECT_NAME} \
   LOCATION=${LOCATION} \
   PROTOCOL=https \
   SERVER_PORT=8000 \
   BACKEND_PORT=8001 \
   FRONTEND_PORT=8002 \
   DB_PORT=27017 \
   DOMAIN_NAME=${DOMAIN_NAME} \
   NODE_ENV=${NODE_ENV} \
   DB_HOST=mongodb \
   MONGODB_USER=${MONGODB_USER} \
   CLIENT_ORIGIN=${DOMAIN_NAME} \
   BACK_END_ORIGIN=${DOMAIN_NAME} \
   MONGODB_PASSWORD=${MONGODB_PASSWORD} \
   MONGODB_REPLICA_SET=${MONGODB_REPLICA_SET} \
   MONGODB_AUTH_MECHANISM=${MONGODB_AUTH_MECHANISM} \
   STORAGE_KEY=./storage_key.json \
   docker compose -f docker-compose.server-${NODE_ENV}.yml up -d"

 echo "Server Configuration is Done!"

echo "Clean..."
ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
"sudo rm -rf docker-compose.* && \
sudo rm -rf deploy*"
docker image prune -a


echo "Successfully deployed!"
