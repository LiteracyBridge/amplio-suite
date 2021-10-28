set -e # halt the setup if any command fails
docker-compose build

# Copy the python deps to the lambdas
CID=$(docker-compose run -d -v python_packages:/usr/local/lib/python3.8/site-packages python-deps true)
docker cp $CID:/usr/local/lib/python3.8/site-packages/. ./lambda/package/
docker rm $CID
docker volume rm python_packages

# Run the migration
# docker-compose run --rm python-deps alembic upgrade head

# Seed the DB
# docker-compose run --rm python-deps python seed_db.py

docker-compose up -d

# Create the local lambdas containers ip resolver
sleep 10
set -x
# The containers created by 'docker-compose build', above, will be named with current directory as a prefix.
current_dir=$(basename `pwd`)
# Find the lambda simulating containers. The format of the generated container names appears to have
# recently changed from workingdir_container ==> workingdir-container, though I can't find that documented
# anywhere. Anyway, that's obviously a breaking change if one were filtering on, say, "_lambda", which
# this was. 
containers=$(docker ps -a -q --filter network="${current_dir}_default" --filter name=lambda)
docker inspect --format '{{.Name}} {{index .Config.Cmd 0}}' $containers | column -t -s' ' > proxy/resolver
docker-compose restart proxy

docker-compose logs -f
