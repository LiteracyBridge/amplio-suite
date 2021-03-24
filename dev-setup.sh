docker-compose build

# Copy the python deps to the lambdas
CID=$(docker-compose run -d -v python_packages:/usr/local/lib/python3.8/site-packages python-deps true)
docker cp $CID:/usr/local/lib/python3.8/site-packages ./lambda/package
docker rm $CID
docker volume rm python_packages

# Run the migration
docker-compose run --rm python-deps alembic upgrade head

docker-compose up -d

# Create the local lambdas containers ip resolver
sleep 10
containers=$(docker ps -a | grep -E 'amplio-suite(-vue)?_lambda' | awk '{print $11}' | sort -k1)
docker inspect --format "{{.Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} {{index .Config.Cmd 0}}" $containers | column -t -s' ' > proxy/resolver
docker-compose restart proxy

docker-compose logs -f
