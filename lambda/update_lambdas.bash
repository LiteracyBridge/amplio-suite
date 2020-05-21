#!/usr/bin/env bash

functions_to_deploy=( testFunction migrations new_program )

created_functions=$(aws lambda list-functions | \
  python3 -c "import sys, json; print([p['FunctionName'] for p in json.load(sys.stdin)['Functions']])")

#
echo -n "Zip the python libs: ..."
zip -r9 -q partial.zip ./package
zip -g -q partial.zip utils.py
echo -e "\rZip the python libs: Done"


for fun in "${functions_to_deploy[@]}"
do
  echo -e "\nProcessing function ${fun}"
	echo -e "\tMaking the zip"
	cp partial.zip ${fun}.zip
	zip -g -q ${fun}.zip ${fun}.py

  if [[ "$created_functions" == *"$fun"* ]]; then
    echo -e "\tUpdating function ${fun}"
  	aws lambda update-function-configuration --function-name ${fun} --environment "Variables={ENV=AWS}" >> output
  	aws lambda update-function-code --function-name ${fun} --zip-file fileb://${fun}.zip >> output
  else
    echo -e "\tCreating function ${fun}"
    aws lambda create-function --function-name ${fun} --runtime python3.8 \
      --role arn:aws:iam::261167734304:role/AmplioSuiteLambda --handler ${fun}.lambda_handler \
      --environment "Variables={ENV=AWS}" --zip-file fileb://${fun}.zip >> output
  fi

  # Remove zip
	rm ${fun}.zip

done

rm partial.zip
