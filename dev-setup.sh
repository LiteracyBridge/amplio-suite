docker-compose build

CID=$(docker-compose run -d -v python_packages:/usr/local/lib/python3.8/site-packages python-deps true)
docker cp $CID:/usr/local/lib/python3.8/site-packages ./lambda/package
docker rm $CID

docker-compose run --rm python-deps curl -d '{}' http://lambda-migration:9001/2015-03-31/functions/db_migrations/invocations
