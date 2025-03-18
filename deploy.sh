#!/bin/sh

set -e

echo "Starting Deploy Frontend..."

source ./setup.sh

# Deploy Frontend: OK.
# scp -o "StrictHostKeyChecking no" -i ssh_key ./docker-compose.frontend-"${NODE_ENV}".yml "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"

# sudo chmod +x ./deploy-frontend.sh \
# && env NODE_ENV="${NODE_ENV}" \
# LOCATION="${LOCATION}" \
# DOMAIN_NAME="${DOMAIN_NAME}" \
# MONGO_URI="${MONGO_URI}" \
# PROJECT_NAME="${PROJECT_NAME}" \
# sh ./deploy-frontend.sh

# # echo "Starting pull frontend..."
# # echo "LOCATION: ${LOCATION}"
# # echo "PROJECT_NAME: ${PROJECT_NAME}"
# # echo "DOMAIN_NAME: ${DOMAIN_NAME}"

# ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no"  \
# "export NODE_ENV='${NODE_ENV}' && \
#  export LOCATION='${LOCATION}' && \
#  export PROJECT_NAME='${PROJECT_NAME}' && \
#  export DOMAIN_NAME='${DOMAIN_NAME}' && \
#  export MONGO_URI='${MONGO_URI}' && \
#  export NEXT_PUBLIC_FRONT_END_ENV='${NODE_ENV}' && \
#  export NEXT_PUBLIC_PROTOCOL='https' && \
#  gcloud auth configure-docker '${LOCATION}-docker.pkg.dev' --quiet && \
#  docker pull '${LOCATION}-docker.pkg.dev/${PROJECT_NAME}/frontend/${DOMAIN_NAME}-frontend:latest' && \
#  NODE_ENV='${NODE_ENV}' \
#  LOCATION='${LOCATION}' \
#  PROJECT_NAME='${PROJECT_NAME}' \
#  DOMAIN_NAME='${DOMAIN_NAME}' \
#  MONGO_URI='${MONGO_URI}' \
#  NEXT_PUBLIC_PROTOCOL='https' \
#  NEXT_PUBLIC_FRONT_END_ENV='${NODE_ENV}' \
#  docker compose -f docker-compose.frontend-prod.yml up -d"

# echo "Frontend Configuration is Done!"


# Deploy Mongo: OK
git clone https://"${GIT_USER}":"${GIT_TOKEN}"@github.com/rslcode/epic_cms_mongo.git
scp -o "StrictHostKeyChecking no" -r -i ssh_key ./epic_cms_mongo/database "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
scp -o "StrictHostKeyChecking no" -i ssh_key ./epic_cms_mongo/docker* "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
scp -o "StrictHostKeyChecking no" -i ssh_key ./epic_cms_mongo/deploy* "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"

ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
"sudo chmod +x deploy-mongo.sh \
&& sudo env NODE_ENV=${NODE_ENV} \
DOMAIN_NAME=${DOMAIN_NAME} \
MONGODB_USER=${MONGODB_USER} \
MONGODB_PASSWORD=${MONGODB_PASSWORD} \
MONGODB_REPLICA_SET=${MONGODB_REPLICA_SET} \
sh deploy-mongo.sh"


# Deploy Backend: OK
#git clone https://"${GIT_USER}":"${GIT_TOKEN}"@github.com/rslcode/epic_cms_backend.git
#
#npm install --legacy-peer-deps --prefix ./epic_cms_backend/backend
#
#REACT_APP_ENV=${NODE_ENV} \
#REACT_APP_PROTOCOL=https \
#REACT_APP_WS_PROTOCOL=wss \
#REACT_APP_SERVER_ORIGIN=${DOMAIN_NAME}/api \
#npm run build --prefix ./epic_cms_backend/backend
##clean dir
#ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
#"rm -rf ./epic_cms_backend/backend/*"
#scp -o "StrictHostKeyChecking no" -pr -i ssh_key ./epic_cms_backend/backend/build/* "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"/backend
#
#echo "Backend Configuration is Done!"

# Deploy Nginx
# if true | openssl s_client -connect "${DOMAIN_NAME}":443 2>/dev/null | openssl x509 -noout -checkend 0;
#   then
#     echo "Certificate is ok..."
#   else
    # echo "Certificate is expired or doesn't exist."
    # echo "Install certificate."
    # git clone https://"${GIT_USER}":"${GIT_TOKEN}"@github.com/rslcode/epic_cms_nginx.git
    # scp -o "StrictHostKeyChecking no" -r -i ssh_key ./epic_cms_nginx/nginx "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
    # scp -o "StrictHostKeyChecking no" -i ssh_key ./docker* "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
    # scp -o "StrictHostKeyChecking no" -i ssh_key ./epic_cms_nginx/deploy* "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
    # # Run deploy nginx sh
    # ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
    # "sudo chmod +x deploy-nginx.sh \
    # && sudo env NODE_ENV=${NODE_ENV} \
    # EMAIL=${EMAIL} \
    # DOMAIN_NAME=${DOMAIN_NAME} \
    # sh deploy-nginx.sh"
# fi

# Update nginx configuration & reload
#ssh -i ssh_key epicms@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
#"docker stop ${DOMAIN_NAME}-nginx && \
#docker start ${DOMAIN_NAME}-nginx"


echo "Clean..."
ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
"sudo rm -rf docker-compose.* && \
sudo rm -rf deploy*"
docker image prune -a


echo "Successfully deployed!"
