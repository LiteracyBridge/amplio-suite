aws dynamodb create-table \
  --table-name local_organizations \
  --attribute-definitions \
    AttributeName=organization,AttributeType=S \
  --key-schema \
    AttributeName=organization,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 \
  --endpoint-url http://localhost:8008

aws dynamodb create-table \
  --table-name local_programs \
  --attribute-definitions \
    AttributeName=program,AttributeType=S \
  --key-schema \
    AttributeName=program,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 \
  --endpoint-url http://localhost:8008

aws dynamodb put-item \
  --table-name local_organizations  \
  --item \
    '{"organization": {"S": "Amplio"}, "parent": {"S": ""}, "roles": {"M": {"@amplio.org": {"S": "PM,CO,FO"}}} }' \
  --endpoint-url http://localhost:8008

aws dynamodb put-item \
  --table-name local_organizations  \
  --item \
    '{"organization": {"S": "Instedd"}, "parent": {"S": "Amplio"}, "roles": {"M": {"@instedd.org": {"S": "AD,PM,CO,FO"}}} }' \
  --endpoint-url http://localhost:8008

aws dynamodb put-item \
  --table-name local_programs  \
  --item \
    '{"organization": {"S": "Instedd"}, "program": {"S": "Some program"}, "roles": {"M": {"diegocamby@gmail.com": {"S": "AD,PM,CO,FO"}}} }' \
  --endpoint-url http://localhost:8008

aws dynamodb put-item \
  --table-name local_programs  \
  --item \
    '{"organization": {"S": "Instedd"}, "program": {"S": "Some program"}, "roles": {"M": {}} }' \
  --endpoint-url http://localhost:8008
