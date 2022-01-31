#!/usr/bin/env zsh

echo "\nShut down Docker containers:"
docker-compose down -v

echo "\nClean up volumes:"
docker volume ls
echo "If 'python-deps' appeared in the previous output, run 'docker volume rm python-deps'."

echo "\nCurrent images:"
docker image ls

if docker image ls|awk '/amplio|none/{print $3;f=1}END{if (f) exit(0);exit(1)}'; then
    echo "\nCleaning old images"
    docker image rm $(docker image ls|awk '/amplio|none/{print $3}')
else
    echo "\nNo old images to clean."
fi

echo "\nThere should be no images tagged with 'amplio' here:"
docker image ls

