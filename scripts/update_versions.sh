#!/bin/sh

set -eu

RELEASE_CHANNEL=$1
echo "RELEASE_CHANNEL: $RELEASE_CHANNEL"

NEW_EXTENSION_VERSION=$2
echo "NEW_EXTENSION_VERSION: $NEW_EXTENSION_VERSION"

NEW_PRISMA_VERSION=$3
echo "NEW_PRISMA_VERSION: $NEW_PRISMA_VERSION"


if [ "$NEW_PRISMA_VERSION" != "" ]; then
    SHA=$(npx -q @prisma/cli@"$NEW_PRISMA_VERSION" version --json | grep "format-binary" | awk '{print $3}')
    jq ".prisma.version = \"$SHA\" | \
    .dependencies[\"@prisma/get-platform\"] = \"$NEW_PRISMA_VERSION\"" \
    ./src/package.json >./src/package.json.bk
fi

