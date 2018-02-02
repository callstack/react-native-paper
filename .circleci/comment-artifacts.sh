#!/bin/bash

URL="https://callstack-github-bot.herokuapp.com/comment"
LINK="https://$CIRCLE_BUILD_NUM-71323749-gh.circle-artifacts.com/$CIRCLE_NODE_INDEX/docs/index.html"
COMMENT="Hey, thank you for your pull request 🤗. The documentation from this branch can be viewed at $LINK"

read -r -d '' DATA << EOM
{
  "pull_request": "$CIRCLE_PULL_REQUEST",
  "body": "$COMMENT",
  "test": {
    "type": "string",
    "data": "The documentation from this branch can be viewed at"
  },
  "update": true
}
EOM

curl \
  -H "Content-Type: application/json" \
  -d "$DATA" \
  -X POST $URL
