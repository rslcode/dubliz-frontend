#!/bin/sh

set -e

echo "Starting Deploy Frontend..."

source ./setup.sh

echo "Certificate is expired or doesn't exist."
echo "Install certificate."
git clone https://"${GIT_USER}":"${GIT_TOKEN}"@github.com/rslcode/epic_cms_nginx.git
scp -o "StrictHostKeyChecking no" -r -i ssh_key ./epic_cms_nginx/nginx epicms@"${SERVER_IP}":/home/epicms
scp -o "StrictHostKeyChecking no" -i ssh_key ./epic_cms_nginx/docker* epicms@"${SERVER_IP}":/home/epicms
scp -o "StrictHostKeyChecking no" -i ssh_key ./epic_cms_nginx/deploy* epicms@"${SERVER_IP}":/home/epicms
# Run deploy nginx sh
ssh -i ssh_key epicms@"${SERVER_IP}" -o "StrictHostKeyChecking no" \
"sudo chmod +x deploy-nginx.sh \
&& sudo env NODE_ENV=${NODE_ENV} \
EMAIL=${EMAIL} \
DOMAIN_NAME=${DOMAIN_NAME} \
sh deploy-nginx.sh"

 # Update nginx configuration & reload
ssh -i ssh_key "${SERVER_USER}"@"${SERVER_IP}" \
"docker exec -i ${DOMAIN_NAME}-nginx nginx -s reload"

echo "nginx successfully deployed!"
