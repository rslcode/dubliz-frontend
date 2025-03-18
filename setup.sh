#!/bin/sh

set -e

echo "Initializing Deploy..."

# Decode SSH key
echo "Convert SSH & Public Key to Base64"
echo "${SSH_KEY}" | base64 -d > ssh_key
chmod 600 ssh_key # private keys need to have strict permission to be accepted by SSH agent

# Add production server to known hosts
echo "Add production server to known hosts"
mkdir -p ~/.ssh
touch ~/.ssh/known_hosts
echo "we there"
echo "${SERVER_PUBLIC_KEY}" | base64 -d >> ~/.ssh/known_hosts

echo "Extract Uploader Key to Work with Google Storage API"
sudo echo "${STORAGE_KEY}" | base64 -d > storage_key.json

echo "Extract Deployment Key"
sudo echo "${GCR_KEY}" | base64 -d > gcr_key

# Google Artifact Registry Docker Login
# Using GCR KEY and Specific Region
# TODO: Implement Location ENV (europe-west2: LOCATION)
cat gcr_key | docker login -u _json_key --password-stdin https://"${LOCATION}"-docker.pkg.dev
# Check Docker Config
cat ~/.docker/config.json

scp -o "StrictHostKeyChecking no" -i ssh_key ./gcr_key "${SERVER_USER}"@"${SERVER_IP}":/home/"${SERVER_USER}"
# scp -o "StrictHostKeyChecking no" -i ssh_key ./storage_key.json epicms@"${SERVER_IP}":/home/epicms
