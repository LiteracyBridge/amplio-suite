#!/usr/bin/env bash

functions_to_deploy=( test_function migrations program_create programs_index program_retrieve )

# Lambda role
role_arn="arn:aws:iam::261167734304:role/AmplioSuiteLambda"

# Read config form AWS
functions=$(aws lambda list-functions | jq '[.Functions[].FunctionName] | join(" ")')
subnet_ids=$(aws ec2 describe-subnets | jq -r '[.Subnets[].SubnetId] | join(",")')
sec_group_id=$(aws ec2 describe-security-groups --group-name 'default' | jq -r '.SecurityGroups[].GroupId')

echo -n "Zip the python libs: ..."
zip -r9 -q partial.zip ./package
zip -g -q partial.zip utils.py
zip -g -q partial.zip .env
zip -r9 -g -q partial.zip migrations
zip -g -q partial.zip alembic.ini
zip -r9 -g -q partial.zip models
zip -r9 -g -q partial.zip amplio
echo -e "\rZip the python libs: Done"

for fun in "${functions_to_deploy[@]}"
do
  echo -e "\nProcessing function ${fun}"
	echo -e "\tMaking the zip"
	cp partial.zip ${fun}.zip
	zip -g -q ${fun}.zip ${fun}.py

  if [[ "$functions" == *"$fun"* ]]; then
    echo -e "\tUpdating function ${fun}"
  	aws lambda update-function-configuration \
			--timeout 30 \
			--function-name ${fun} \
			--environment "Variables={ENV=AWS}" >> output
  	aws lambda update-function-code \
			--function-name ${fun} \
			--zip-file fileb://${fun}.zip >> output
  else
    echo -e "\tCreating function ${fun}"
    aws lambda create-function \
			--timeout 30 \
			--role ${role_arn} \
			--function-name ${fun} \
			--runtime python3.8 \
			--zip-file fileb://${fun}.zip \
			--handler ${fun}.lambda_handler \
      --environment "Variables={ENV=AWS}" \
			--vpc-config SubnetIds=${subnet_ids},SecurityGroupIds=${sec_group_id} >> output
  fi

  # Remove zip
	rm ${fun}.zip
done

rm partial.zip
