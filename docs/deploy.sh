#!/bin/bash

set -e

git clone https://${GITHUB_TOKEN}@github.com/react-native-paper/react-native-paper.github.io.git docs/dist

cd docs && npm run build && cd dist

if [ -z "$(git diff --exit-code)" ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

git config user.name "Travis CI"
git config user.email "bot@travis.org"

git add .
git commit -m "Deploy documentation: $(git rev-parse --verify HEAD)"

git push -f -u origin master
