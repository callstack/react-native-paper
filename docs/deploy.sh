#!/bin/bash

set -e

git clone https://${GITHUB_TOKEN}@github.com/callstack-io/react-native-paper.git docs/dist

cd docs/dist

git checkout gh-pages
rm -rf **

cd .. && npm run build && cd dist

if [ -z "$(git diff --exit-code)" ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

git config user.name "Travis CI"
git config user.email "bot@travis-ci.org"

git add -A .
git commit -m "Deploy documentation: $(git rev-parse --verify HEAD)"

git push -f -u origin gh-pages
