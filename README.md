# Amplio Suite

- [Amplio Suite](#amplio-suite)
  - [1. Local](#1-local)
    - [1.1. Providing a PostgreSQL database](#11-providing-a-postgresql-database)
    - [1.2. Starting your local serve](#12-starting-your-local-serve)
  - [2. Stg](#2-stg)
    - [2.1. Run Migrations](#21-run-migrations)
    - [2.2. Deploy](#22-deploy)
  - [3. Production](#3-production)
    - [3.1. Run Migration](#31-run-migration)
    - [3.2. Deploy](#32-deploy)
  - [4. Tailwind convention](#4-tailwind-convention)
  - [5. Auto-generate migration](#5-auto-generate-migration)
  - [6. API gateway](#6-api-gateway)
  - [7. Minimum browser requirements](#7-minimum-browser-requirements)
    - [7.1. Browsers versions](#71-browsers-versions)
    - [7.2. Screen resolutions](#72-screen-resolutions)

## 1. Local

### 1.1. Providing a PostgreSQL database

You will need to provide a PostgreSQL database for the test environment. It is convenient
to provide one on your local machine. After the PostgreSQL is up and running, export the
connect string for SQL Alchemy. On MacOS that string will look something like this:

```
export DATABASE_URL=postgresql+psycopg2://MyTestUser:MySecretPassword@docker.for.mac.host.internal:5432/dashboard
```
For other OSes, see the Docker documentation to determine the equivalent of "docker.for.mac.host.internal".

### 1.2. Starting your local serveer
Once the PostgreSQL database has been set up, run this script:

```bash
./dev-setup.sh
```
When you are finished with your test environment, use ```Ctrl+C``` to kill the web server and then
run these comands:
```bash
docker-compose down -v

docker volume ls
docker volume rm python-deps # Only if python-deps is listed in the previous command

docker image ls
docker image rm <id> # Replace "<id>" by the corresponding id for amplio-suite-vue_python-deps
```
## 2. Stg


### 2.1. Run Migrations

~~In local and stg environments we have a lambda function with alembic to handle migrations.
To run the migration, go to this [lambda]( https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions/migrations) and run the test with the `Migration` event~~

~~The `migration lambda` can do an upgrade or downgrade to a specific version. For more info, see the lambda doc.~~

Any data migrations must be handled outside of this project, because it will need to be coordinated
across multiple applications, scripts, and so forth.

### 2.2. Deploy

We have an action on github to update the website. To update the lambdas we have to set the aws credentials in `lambda/env.local.bash` with the stg (or prod) keys and run

```bash
docker-compose run --rm python-deps update_lambdas.bash
```

## 3. Production

### 3.1. Run Migration

In production we don’t have configured alembic to run the migration. In the local environment, we are going to generate sql migrations using alembic and then run this sql files.

__See 2.1 above__

```bash
# Use the version id to generate the migration file
docker-compose run --rm python-deps alembic upgrade b33dbd8685c6 --sql > migrations.sql

# Or use start:end ids for multiple version migrations
docker-compose run --rm python-deps alembic upgrade 10b0848a46f0:b33dbd8685c6 --sql > migrations.sql
```

~~For more examples and documentation read~~ [alembic offline mode](https://alembic.sqlalchemy.org/en/latest/offline.html)

~~In the new sql file, remove the line that updates the `alembic_version` table. We don’t have this table in production.
Now we can run this file in the DB using psql or adminer.~~

### 3.2. Deploy

See [stg deploy](#22-deploy) doc

## 4. Tailwind convention

tl;dr:
"Tailwind" was used for the initial project. (Do not ask me why; it makes no sense to me.) It
is not to used in any further development.

####Details:
Tailwind is based on the premise that "CSS is hard." However, their solution is to throw out
CSS and apply styling directly to every element. CSS is hard, and very poorly thought out, but
throwing the baby out with the bath is not the solution.

~~We will use tailwind css for styling and the classes will be applied in the following order:~~

- ~~spacing will be only top and left~~
- ~~classes will be listed in the order: layout/flex/position, spacing, text style, colors, decorations/borders/shadows/etc and lastly the pseudo state modifiers (ej. :hover, :focus)~~

## 5. Auto-generate migration

_This section intentionally blank._

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
