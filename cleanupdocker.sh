#!/bin/bash

docker container prune -f
docker volume rm wonderingwandering_web-root
docker volume prune -f