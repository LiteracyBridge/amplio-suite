#!/usr/bin/env bash
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

function warn_no_env_local_bash() {
	echo 'export AWS_ACCESS_KEY_ID=""' > env.local.bash
	echo 'export AWS_SECRET_ACCESS_KEY=""' >> env.local.bash
	echo "*** Please fill ${PWD}/env.local.bash with your AWS credentials"
	exit 1
}

[ -a env.local.bash ] && . env.local.bash || warn_no_env_local_bash

function die() {
	echo $1
	exit 1
}

[ -n "$AWS_ACCESS_KEY_ID" ] || die "Set AWS_ACCESS_KEY_ID in env.local.bash"
[ -n "$AWS_SECRET_ACCESS_KEY" ] || die "Set AWS_ACCESS_KEY_ID in env.local.bash"
export AWS_DEFAULT_REGION=us-west-2

functions_to_deploy=( cognito_pre_sign_up cognito_custom_message migrations program_create program_retrieve programs_index project_create project_retrieve content_create content_retrieve contetn_update )

# Lambda role
role_arn="arn:aws:iam::261167734304:role/AmplioSuiteLambda"

# Read config form AWS
functions=$(aws lambda list-functions | jq '[.Functions[].FunctionName] | join(" ")')
subnet_ids=$(aws ec2 describe-subnets | jq -r '[.Subnets[].SubnetId] | join(",")')
sec_group_id=$(aws ec2 describe-security-groups --group-name 'default' | jq -r '.SecurityGroups[].GroupId')

echo -n "Zip the python libs: ..."
zip -r9 -q partial.zip ./package
zip -g -q partial.zip utils.py
zip -g -q partial.zip decorators.py
zip -g -q partial.zip .env
zip -r9 -g -q partial.zip migrations
zip -g -q partial.zip alembic.ini
zip -r9 -g -q partial.zip models
zip -r9 -g -q partial.zip amplio
echo -e "\rZip the python libs: Done"

set +e

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
