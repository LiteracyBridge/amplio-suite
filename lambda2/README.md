# Amplio Suite Lambda

## Setup

```bash
$ mkdir package
$ docker-compose up --build
# Run the migrations
$ curl -d '{}' http://localhost:9001/2015-03-31/functions/db_migrations/invocations
```

Next time only make compose up.


## Auto-generate migration

After update the models class on `lambda/models` run

```bash
$ docker-compose run --rm deps alembic revision --autogenerate -m "Migration name"
```

If you create a new table class, add this class in `lambda/alembic/env.py`


## Update lambda functions to AWS

First run `docker-compose up` to create the `package` dir and then

```bash
$ ./update_lambdas.bash
```
