#!/bin/bash
set -eo pipefail
set -x	
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

BACKEND_CORS_ORIGINS=https://suite.amplio.org
BACKEND_CORS_ORIGINS='*'
ENVIRONMENT=production

function die() {
	echo $1
	exit 1
}

function warn_no_env_local_bash() {
	echo 'export AWS_ACCESS_KEY_ID=""' > lambda/env.local.bash
	echo 'export AWS_SECRET_ACCESS_KEY=""' >> lambda/env.local.bash
	echo 'export BACKEND_CORS_ORIGINS=""' >> lambda/env.local.bash
	echo 'export ENVIRONMENT=""' >> lambda/env.local.bash
	echo "*** Please fill lambda/env.local.bash with your AWS credentials"
	exit 1
}

function create_or_update_lambda() {
	# Args: fun_name, zip, handler
	if [[ "$functions" == *"$1"* ]]; then
    echo -e "\tUpdating function ${1}"
  	aws lambda update-function-configuration \
			--timeout 30 \
			--function-name ${1} \
			--layers ${layer_arn} \
			--handler ${3} \
			--environment "Variables={ENV=AWS,BACKEND_CORS_ORIGINS=$BACKEND_CORS_ORIGINS,ENVIRONMENT=$ENVIRONMENT}" \
			--description "Part of the Suite at suite.amplio.org" >> output
  	aws lambda update-function-code \
			--function-name ${1} \
			--zip-file fileb://${2} >> output
  else
    echo -e "\tCreating function ${1}"
    aws lambda create-function \
			--timeout 30 \
			--role ${role_arn} \
			--function-name ${1} \
			--layers ${layer_arn} \
			--runtime python3.8 \
			--zip-file fileb://${2} \
			--handler ${3} \
      --environment "Variables={ENV=AWS,BACKEND_CORS_ORIGINS=$BACKEND_CORS_ORIGINS,ENVIRONMENT=$ENVIRONMENT}" \
			--description "Part of the Suite at suite.amplio.org" \
			--vpc-config SubnetIds=${subnet_ids},SecurityGroupIds=${sec_group_id} >> output
  fi
}

[ -a lambda/env.local.bash ] && . lambda/env.local.bash || warn_no_env_local_bash

[ -n "$AWS_ACCESS_KEY_ID" ] || die "Set AWS_ACCESS_KEY_ID in lambda/env.local.bash"
[ -n "$AWS_SECRET_ACCESS_KEY" ] || die "Set AWS_ACCESS_KEY_ID in lambda/env.local.bash"
[ -n "$BACKEND_CORS_ORIGINS" ] || die "Set BACKEND_CORS_ORIGINS in lambda/env.local.bash"
[ -n "$ENVIRONMENT" ] || die "Set ENVIRONMENT in lambda/env.local.bash"
export AWS_DEFAULT_REGION=us-west-2

[ -d ./lambda/package ] || die "The directory \`lambda/package\` doesn't exist. Please run \`./dev-setup.sh\` first in order to fetch the Python dependencies"

# Function to deploy not defined in the docker-compose.yml
functions_to_deploy=(
	cognito_custom_message
	cognito_pre_sign_up
)

# Create a tsv with the functions to deploy with the form
# function_name dir_name handler
# echo "Reading function to deploy from docker-compose: ..."
# containers=$(docker ps -a --format '{{ .Names }}' | grep -E 'amplio-suite(-vue)?_lambda' | sort -k1)
# docker inspect --format '{{ .Name }} {{ index .Config.Cmd 0 }} {{ index .Config.Cmd 0 }}' $containers | column -t -s' ' > functions_tmp.txt

# sed -E -e 's/^\/amplio-suite(-vue)?_lambda-(.*)_1/\2 /'g \
#    -e 's/ (\w+).\w+.\w+ / \1 /'g \
#    -e 's/ \w+.(\w+.\w+)$/\1/'g functions_tmp.txt | column -t > functions.txt
# echo "Reading function to deploy from docker-compose: Done"

# Lambda role
echo "Getting the lambda role: ..."
role_arn=$(aws iam get-role --role-name AmplioSuiteLambda | jq -r '.Role.Arn')
echo "Getting the lambda role: Done"

# Read config from AWS
echo "Getting the functions already deployed: ..."
functions=$(aws lambda list-functions | jq '[.Functions[].FunctionName] | join(" ")')
subnet_ids=$(aws ec2 describe-subnets | jq -r '[.Subnets[].SubnetId] | join(",")')
sec_group_id=$(aws ec2 describe-security-groups --group-name 'default' | jq -r '.SecurityGroups[].GroupId')
echo "Getting the functions already deployed: Done"

echo "Zip the python libs: ..."
mkdir -p python && rm -rf ./python/ && mkdir ./python/
cp -r ./lambda/* ./lambda/package/* python/
rm -r python/package python/env.local.bash
zip -r9 -q partial.zip ./python
echo "Zip the python libs: Done."

echo "Uploading layer..."
layer_arn=$(aws lambda publish-layer-version --layer-name base-layer --description "Suite shared dependencies and codebase" --compatible-runtimes python3.8 --zip-file fileb://partial.zip | jq -r '.LayerVersionArn')
echo "The layer ARN is: ${layer_arn}"
# rm -rf partial.zip ./python/
set +e

# Create/update functions defined in the docker-compose
while read -r fun_name fun_dir handler
do
  echo -e "\nProcessing function ${fun_name}"
	echo -e "\tMaking the zip"
	zip -q -j ${fun_dir}.zip ./lambda/${fun_dir}/*

	create_or_update_lambda ${fun_name} ${fun_dir}.zip ${handler}

  # Remove zip
	rm ${fun_dir}.zip
done < "lambdas-list.txt"

# echo "Create/Update aditionals functions"
# for fun_name in "${functions_to_deploy[@]}"
# do
# 	echo -e "\nProcessing function ${fun_name}"
# 	echo -e "\tMaking the zip"
# 	zip -q ${fun_name}.zip ./lambda/${fun_name}.py

# 	create_or_update_lambda ${fun_name} ${fun_name}.zip ${fun_name}.lambda_handler

#   # Remove zip
# 	rm ${fun_name}.zip
# done

#rm functions_tmp.txt functions.txt
