#!/bin/sh

set -eu

NPM_CHANNEL=$1
echo "NPM_CHANNEL: $NPM_CHANNEL"

NEW_NPM_VERSION=$2
echo "NEW_NPM_VERSION: $NEW_NPM_VERSION"

echo "UPDATING to Prisma CLI version $NPM_VERSION"


if [ "$NPM_CHANNEL" = "dev" ]; then
    echo "$NEW_NPM_VERSION"> scripts/versions/prisma_dev
fi