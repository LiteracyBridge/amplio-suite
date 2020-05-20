#!/usr/bin/env bash

# Funtions to dpeloy
# functions=( testFunction db_migrations new_program )
functions=( testFunction )

echo -n "Zip the python libs: ..."
zip -r9 -q partial.zip ./package
echo -e "\rZip the python libs: Done"

for fun in "${functions[@]}"
do
	echo "Processing function ${fun}"
	echo "	Making the zip"
	cp partial.zip ${fun}.zip
	zip -g -q ${fun}.zip ${fun}.py

	echo "	Deploy to AWS"
	aws lambda update-function-code --function-name ${fun} --zip-file fileb://${fun}.zip

	# Remove zip
	rm ${fun}.zip
done

rm partial.zip
