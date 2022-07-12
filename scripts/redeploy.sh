#!/bin/bash

# This script is meant to run on the ec2 directly.
# Invoked when someone pushes commits.

git reset --hard
git pull origin master
cp ./scripts/docker-compose.yml ./
cp /home/ubuntu/.env ./backend/

sudo docker compose stop server
sudo docker compose up --build -d
