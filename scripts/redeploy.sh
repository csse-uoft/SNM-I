#!/bin/bash

# This script is meant to run on the remote server directly.
# Invoked when someone pushes commits.

cd /home/ubuntu/SNM-I/
cp -f ./scripts/docker-compose.yml ./
cp -f ./scripts/redeploy.sh /home/ubuntu/
cp -f /home/ubuntu/.env ./backend/


sudo docker compose stop server caddy
sudo docker compose up --build -d
