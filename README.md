# Amplio Suite

- [Amplio Suite](#amplio-suite)
  - [1. Local](#1-local)
    - [1.1 One-time setup](#11-one-time-setup)
    - [1.2. Starting your local serve](#12-starting-your-local-serve)
    - [1.3. Migrations](#13-migrations)
  - [2. Stg](#2-stg)
    - [2.1. Migrations](#21-migrations)
    - [2.2. Deploy](#22-deploy)
  - [3. Production](#3-production)
    - [3.1. Migration](#31-migration)
    - [3.2. Deploy](#32-deploy)
  - [4. Tailwind convention](#4-tailwind-convention)
  - [5. Auto-generate migration](#5-auto-generate-migration)
  - [6. API gateway](#6-api-gateway)
  - [7. Minimum browser requirements](#7-minimum-browser-requirements)
    - [7.1. Browsers versions](#71-browsers-versions)
    - [7.2. Screen resolutions](#72-screen-resolutions)

## 1. Local

### 1.1 One-time setup

```bash
Git clone https://github.com/instedd/amplio-suite.git
Cd amplio-suite
./dev-setup.sh
```

If necessary, the one time setup can be undone by running these commnands:
```cd amplio-suite
docker-compose down -v

docker volume ls
docker volume rm python-deps # Si existe en el comando anterior

docker image ls
docker image rm (id de amplio-suite-vue_python-deps)
```

### 1.2. Starting your local serve

```bash
docker-compose up
```

### 1.3. Migrations

After generating a new migration version with alembic, we execute

```bash
docker-compose run --rm python-deps alembic upgrade head
```

## 2. Stg

### 2.1. Migrations

In local and stg environments we have a lambda function with alembic to handle migrations.
To run the migration, go to this [lambda]( https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions/migrations) and run the test with the `Migration` event

The `migration lambda` can do an upgrade or downgrade to a specific version. For more info, see the lambda doc.

### 2.2. Deploy

We have an action on github to update the website. To update the lambdas we have to set the aws credentials in `lambda/env.local.bash` with the stg (or prod) keys and run

```bash
docker-compose run --rm python-deps update_lambdas.bash
```

## 3. Production

### 3.1. Migration

In production we don’t have configured alembic to run the migration. In the local environment, we are going to generate sql migrations using alembic and then run this sql files.

```bash
# Use the version id to generate the migration file
docker-compose run --rm python-deps alembic upgrade b33dbd8685c6 --sql > migrations.sql

# Or use start:end ids for multiple version migrations
docker-compose run --rm python-deps alembic upgrade 10b0848a46f0:b33dbd8685c6 --sql > migrations.sql
```

For more examples and documentation read [alembic offline mode](https://alembic.sqlalchemy.org/en/latest/offline.html)

In the new sql file, remove the line that updates the `alembic_version` table. We don’t have this table in production.
Now we can run this file in the DB using psql or adminer.

### 3.2. Deploy

See [stg deploy](#22-deploy) doc

## 4. Tailwind convention

We will use tailwind css for styling and the classes will be applied in the following order:

- spacing will be only top and left
- classes will be listed in the order: layout/flex/position, spacing, text style, colors, decorations/borders/shadows/etc and lastly the pseudo state modifiers (ej. :hover, :focus)

## 5. Auto-generate migration

If you make modifications to the database structure, this command will generate the corresponding migration, after updating the models class on `lambda/models` run:

```bash
docker-compose run --rm python-deps alembic revision --autogenerate -m "Migration name"
```

If you create a new table class, add this class in `lambda/migrations/env.py`

## 6. API gateway

API Gateway is yet to be automated. For the time being, every time we create a new lambda function that has to be exposed we have to declare the new endpoint in API Gateway.

To enforce user authentication via Cognito, we require authorization in the `AmplioSuite` user pool on the Method Request step of each method, and we use a Mapping Template on the `Integration Request` step to both allow-list the expected parameters of the function **and** add a `context.username` key to the `event` with the user's email. This is a sample `application/json` template from one of the methods:

```JSON
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

## 7. Minimum browser requirements

### 7.1. Browsers versions

The following are the minimum supported browsers versions:

Google Chrome 80.0+
Firefox 75.0+
Safari 13+
Opera 67+
Edge 18+

### 7.2. Screen resolutions

The minimum supported screen resolution is 1366x768. Mobile devices and screen resolutions less than 1366x768 are not supported.
