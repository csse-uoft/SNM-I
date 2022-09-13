#!/bin/bash

# This script is meant to run on the ec2 directly.
# Invoked when someone pushes commits.

cd /home/ubuntu/SNM-I/
sudo -u ubuntu bash -c 'git reset --hard'
sudo -u ubuntu bash -c 'git pull'
cp -f ./scripts/docker-compose.yml ./
cp -f ./scripts/redeploy.sh /home/ubuntu/
cp -f /home/ubuntu/.env ./backend/


sudo docker compose stop server
sudo docker compose up --build -d
