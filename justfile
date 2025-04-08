set positional-arguments := true

default:
    @just --choose

deploy-testing:
    #!/usr/bin/env sh

    yarn install
    yarn build:staging

    [ -d "/var/www/suite-test" ] && \
        sudo rm --recursive --force /var/www/suite-test

    sudo mv dist /var/www/suite-test

    rm --recursive node_modules
