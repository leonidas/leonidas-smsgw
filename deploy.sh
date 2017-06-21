#!/bin/bash
set -xue
docker-compose build
docker-compose push
kontena stack upgrade --deploy smsgw kontena.yml
