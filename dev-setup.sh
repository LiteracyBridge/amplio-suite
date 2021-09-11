set -e # halt the setup if any command fails
docker-compose build

# Copy the python deps to the lambdas
CID=$(docker-compose run -d -v python_packages:/usr/local/lib/python3.8/site-packages python-deps true)
docker cp $CID:/usr/local/lib/python3.8/site-packages/. ./lambda/package/
docker rm $CID
docker volume rm python_packages

# Run the migration
docker-compose run --rm python-deps alembic upgrade head

# Seed the DB
docker-compose run --rm python-deps python seed_db.py

docker-compose up -d

# Create the local lambdas containers ip resolver
sleep 10
current_dir=$(basename `pwd`)
containers=$(docker ps -a -q --filter network="${current_dir}_default" --filter name=_lambda)
docker inspect --format '{{.Name}} {{index .Config.Cmd 0}}' $containers | column -t -s' ' > proxy/resolver
docker-compose restart proxy

docker-compose logs -f
