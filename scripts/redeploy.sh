#!/bin/bash

# This script is meant to run on the ec2 directly.
# Invoked when someone pushes commits.

sudo git reset --hard
sudo git pull
cp -f ./scripts/docker-compose.yml ./
cp -f /home/ubuntu/.env ./backend/

sudo docker compose stop server
sudo docker compose up --build -d
