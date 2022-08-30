#!/usr/bin/env zsh
if [ -z "${DATABASE_URL}" ]; then

    u=$(cat ~/.pgpass|awk -F : '/localhost/{if($4!="bill") print $4}')
    p=$(cat ~/.pgpass|awk -F : '/localhost/{if($4!="bill") print $5}')

    echo "Please set DATABASE_URL first"
    echo "export DATABASE_URL=postgresql+psycopg2://${u}:${p}@docker.for.mac.host.internal:5432/dashboard"
    exit 1
fi

./dev-setup.sh
