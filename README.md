# Amplio Suite

## Setup

```bash
$ git clone <this project>
$ cd amplio-suite

$ mkdir lambda/package
$ docker-compose up --build

# Run the migrations
# Once the docker compose finishes loading, run this command in a new terminal window, within the project's directory.
$ curl -d '{}' http://localhost:9000/migrations
```

Next time only run `docker-compose up`.


## Front-End
### Build
The build is done automatically by Github Actions, but in case you need to do it manually, you can follow these steps.

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

### API gateway

TODO


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
