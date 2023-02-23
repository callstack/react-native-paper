#!/bin/bash

# Based on domenic's tutorial: https://gist.github.com/domenic/ec8b0fc8ab45f39403dd

set -euxo pipefail # Exit with nonzero exit code if anything fails

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SOURCE_BRANCH="main"
TARGET_BRANCH="gh-pages"

git checkout $SOURCE_BRANCH

cd $DIR/..

# Install React Native Paper dependencies for examples
yarn

cd docs

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into dist/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deploy)
git clone $REPO dist
cd dist
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean existing dist/ contents
rm -rf dist/**/* || :
rm -f dist/*.{html,css,js,json,map,xml} || :
rmdir dist/* || :

# Run our build script.
yarn
yarn build

# Move the built docs to cloned `gh-pages` directory
cp -R build/. dist

rm -rf build

# Change directory to the one using `gh-pages` branch
cd dist

# Configure git.
git config user.name "$COMMIT_AUTHOR_NAME"
git config user.email "$COMMIT_AUTHOR_EMAIL"

git add -A .

# If there are no changes to the compiled dist (e.g. this is a README update) then just bail.
if git diff --cached --quiet; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH

# Change back to original branch
cd ..
git checkout $SOURCE_BRANCH
yarn
