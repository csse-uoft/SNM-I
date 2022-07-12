#!/bin/bash

# This script is meant to run on the ec2 directly.

git pull origin master

docker-compose -f ./scripts/docker-compose.yml stop server
docker-compose -f ./scripts/docker-compose.yml up --build -d server
