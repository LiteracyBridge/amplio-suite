#!/bin/sh

set pipefail -euo

NODE_OPTIONS=--max_old_space_size=4096 npm run staging-build

# Remove old build
aws s3 rm s3://suite-test.amplio.org --recursive

# Copy new build
aws s3 cp --recursive dist/ s3://suite-test.amplio.org

exit 0
