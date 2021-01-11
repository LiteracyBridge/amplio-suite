# Amplio Suite

## Setup

```bash
./dev-setup.sh
```

Next time only run `docker-compose up`.

## Front-End
### Build
The build is done automatically by Github Actions, but in case you need to do it manually, you can follow these steps.

```bash
$ docker-compose run --rm web yarn build
$ aws s3 sync dist/ s3://amplio-suite
```

Github Actions deploy a new staging version of the SPA upon new pushes to the `master` branch, and a new production version when there's a push to the `stable` branch.

### Tailwind convention

We will use tailwind css for styling and the classes will be applied in the following order:

- spacing will be only top and left
- classes will be listed in the order: layout/flex/position, spacing, text style, colors, decorations/borders/shadows/etc and lastly the pseudo state modifiers (ej. :hover, :focus)

## Back-End
### Auto-generate migration
If you make modifications to the database structure, this command will generate the corresponding migration.
After updating the models class on `lambda/models` run:

```bash
$ docker-compose run --rm python-deps alembic revision --autogenerate -m "Migration name"
```

If you create a new table class, add this class in `lambda/migrations/env.py`

### Deploy lambda functions

- Make sure you have created an empty `lambda/package` directory
- Run `docker-compose up` to populate the `package` dir. Then

```bash
$ ./update_lambdas.bash
```

The script depends on a `lambda/env.local.bash` file that should `export` both the `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` env variables. To choose which environment to deploy to (ie, staging or production), you just have to provide the credentials for the corresponding AWS account.

### API gateway

API Gateway is yet to be automated. For the time being, every time we create a new lambda function that has to be exposed we have to declare the new endpoint in API Gateway.

To enforce user authentication via Cognito, we require authorization in the `AmplioSuite` user pool on the Method Request step of each method, and we use a Mapping Template on the `Integration Request` step to both allow-list the expected parameters of the function **and** add a `context.username` key to the `event` with the user's email. This is a sample `application/json` template from one of the methods:

```
#set($inputRoot = $input.path('$'))
{
    "program_code": "$input.params('program_code')",
    "deployment": "$input.params('deployment')",
    
    "context": {
        "username": "$context.authorizer.claims["cognito:username"]"
    }
}
```

The `program_code` and `deployment` parameters should be the ones that the lambda expect.

## Deploying the project

When deploying to production, bear in mind the problems we had in staging:

- [Add secrets manager to the VPC](https://aws.amazon.com/blogs/security/how-to-connect-to-aws-secrets-manager-service-within-a-virtual-private-cloud/)

## Minimum browser requirements

### Browsers versions
The following are the minimum supported browsers versions:

Google Chrome 80.0+
Firefox 75.0+
Safari 13+
Opera 67+
Edge 18+

### Screen resolutions
The minimum supported screen resolution is 1366x768. Mobile devices and screen resolutions less than 1366x768 are not supported.
