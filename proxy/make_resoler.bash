containers=$(docker ps -a | grep -E 'amplio-suite(-vue)?_lambda' | awk '{print $11}' | sort -k1)
docker inspect --format "{{.Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}} {{index .Config.Cmd 0}}" $containers | column -t -s' '
