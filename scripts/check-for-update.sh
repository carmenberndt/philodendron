#!/bin/sh

set -eu

# get currently used Prisma CLI versions
CURRENT_PRISMA_DEV_VERSION=$(cat scripts/versions/prisma_dev)

echo "CURRENT_PRISMA_DEV_VERSION: $CURRENT_PRISMA_DEV_VERSION"

# get latest Prisma CLI versions from npm
NPM_PRISMA_DEV_VERSION=$(sh scripts/versions/npm-prisma-version.sh "dev")

echo "NPM_PRISMA_DEV_VERSION: $NPM_PRISMA_DEV_VERSION"

if [ "$CURRENT_PRISMA_DEV_VERSION" != "$NPM_PRISMA_DEV_VERSION" ]; then
    echo "New Prisma CLI version for dev available."
    echo "::set-output name=dev-version::$NPM_PRISMA_DEV_VERSION"
fi
