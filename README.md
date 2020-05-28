# Amplio Suite

## Setup

```bash
$ git clone https://github.com/manastech/amplio-suite-vue.git
$ cd amplio-suite-vue

$ mkdir lambda/package
$ docker-compose up --build

# Run the migrations
$ curl -d '{}' http://localhost:9000/migrations
```

Next time only run `docker-compose up`.


## Font-End
### Build

```bash
$ docker-compose run --rm web yarn build
$ aws s3 sync dist/ s3://amplio-suite
```

### Tailwind convention

We will use tailwind css for styling and the classes will be applied in the following order:

- spacing will be only top and left
- classes will be listed in the order: layout/flex/position, spacing, text style, colors, decorations/borders/shadows/etc and lastly the pseudo state modifiers (ej. :hover, :focus)

## Back-End
### Auto-generate migration

After update the models class on `lambda/models` run

```bash
$ docker-compose run --rm python-deps alembic revision --autogenerate -m "Migration name"
```

If you create a new table class, add this class in `lambda/migrations/env.py`

### Deploy lambda functions

- Create an empty `lambda/package` directory
- Run `docker-compose up` to populate the `package` dir. Then

```bash
$ ./update_lambdas.bash
```

### API gatway

TODO


## For deploy

Note some problems we had in staging, for the day we go to prod

- [Add secrets manager to the VPC](https://aws.amazon.com/blogs/security/how-to-connect-to-aws-secrets-manager-service-within-a-virtual-private-cloud/)
