#!/usr/bin/env zsh
if [ -z "${DATABASE_URL}" ]; then

    u=$(cat ~/.pgpass|awk -F : '/localhost/{if($4!="bill") print $4}')
    p=$(cat ~/.pgpass|awk -F : '/localhost/{if($4!="bill") print $5}')

    echo "Setting DATABASE_URL"
    export DATABASE_URL=postgresql+psycopg2://${u}:${p}@docker.for.mac.host.internal:5432/dashboard
fi

./dev-setup.sh
