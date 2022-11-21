#!/usr/bin/env zsh

docker version >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Docker does not seem to be running. $?. Start with:"
    echo /Applications/Docker.app/Contents/MacOS/Docker
    exit 1
fi

if [ -z "${DATABASE_URL}" ]; then

    u=$(cat ~/.pgpass|awk -F : '/localhost/{if($4!="bill") print $4}')
    p=$(cat ~/.pgpass|awk -F : '/localhost/{if($4!="bill") print $5}')

    echo "Setting DATABASE_URL"
    export DATABASE_URL=postgresql+psycopg2://${u}:${p}@docker.for.mac.host.internal:5432/dashboard
fi

./dev-setup.sh
