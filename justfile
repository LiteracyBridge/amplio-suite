set positional-arguments := true

default:
    @just --choose

deploy-testing:
    yarn install
    yarn build:staging

    [ -d "/var/www/suite-test" ] && \
        sudo rm --recursive --force /var/www/suite-test

    sudo mkdir --parents /var/www/suite-test
    sudo cp --recursive --verbose --force dist /var/www/suite-test

    rm --recursive node_modules
