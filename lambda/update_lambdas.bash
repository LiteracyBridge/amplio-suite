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

functions_to_deploy=(
	cognito_pre_sign_up cognito_custom_message migrations programs_index
	project_retrieve project_create
	program_retrieve program_create program_update program_next_deployment
	deployment_retrieve deployment_update deployment_delete
	content_retrieve content_create content_update
	playlist_create message_create languages_index
)

# Lambda role
role_arn="arn:aws:iam::261167734304:role/AmplioSuiteLambda"

# Read config form AWS
functions=$(aws lambda list-functions | jq '[.Functions[].FunctionName] | join(" ")')
subnet_ids=$(aws ec2 describe-subnets | jq -r '[.Subnets[].SubnetId] | join(",")')
sec_group_id=$(aws ec2 describe-security-groups --group-name 'default' | jq -r '.SecurityGroups[].GroupId')

echo "Zip the python libs: ..."
mkdir -p python && rm -rf ./python/ && mkdir ./python/
cp -r ./package/ utils.py decorators.py .env ./migrations alembic.ini ./models ./amplio python/
zip -r9 -q partial.zip ./python
echo "Zip the python libs: Done. Uploading layer..."

layer_arn=$(aws lambda publish-layer-version --layer-name base-layer --description "Shared dependencies and codebase" --compatible-runtimes python3.8 --zip-file fileb://partial.zip | jq -r '.LayerVersionArn')
echo "The layer ARN is: ${layer_arn}"
rm -rf partial.zip ./python/
set +e

for fun in "${functions_to_deploy[@]}"
do
  echo -e "\nProcessing function ${fun}"
	echo -e "\tMaking the zip"
	zip -q ${fun}.zip ${fun}.py

  if [[ "$functions" == *"$fun"* ]]; then
    echo -e "\tUpdating function ${fun}"
  	aws lambda update-function-configuration \
			--timeout 30 \
			--function-name ${fun} \
			--layers ${layer_arn} \
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
			--layers ${layer_arn} \
			--runtime python3.8 \
			--zip-file fileb://${fun}.zip \
			--handler ${fun}.lambda_handler \
      --environment "Variables={ENV=AWS}" \
			--vpc-config SubnetIds=${subnet_ids},SecurityGroupIds=${sec_group_id} >> output
  fi

  # Remove zip
	rm ${fun}.zip
done
