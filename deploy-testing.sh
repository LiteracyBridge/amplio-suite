#!/bin/sh

set pipefail -euo

docker build --tag test-suite --build-arg PORT=6001 .
    docker run --publish 127.0.0.1:6001:6001 \
        --restart always \
        --detach test-suite
