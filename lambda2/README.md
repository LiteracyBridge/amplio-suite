# Amplio Suite Lambda

## Run

```bash
$ docker-compose up --build
```

## Migration

```bash
# Add a new migration
$ docker-compose run --rm deps alembic revision -m "migration name"

# Fill the migrations functions on alembic/version

# Run the migration
$ docker-compose run --rm deps alembic upgrade head
```

## TODO

- [ ] Usar .env para guardar la url de la db
