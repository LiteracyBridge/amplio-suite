#!/usr/bin/env zsh
if [ -z "${DATABASE_URL}" ]; then

    echo "Please set DATABASE_URL first"
    echo "export DATABASE_URL=postgresql+psycopg2://MyTestUser:MySecretPassword@docker.for.mac.host.internal:5432/dashboard"
    exit 1
fi

./dev-setup.sh
