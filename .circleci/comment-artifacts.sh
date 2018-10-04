#!/bin/bash

URL="https://callstack-github-bot.herokuapp.com/comment"
LINK="https://$CIRCLE_BUILD_NUM-71323749-gh.circle-artifacts.com/$CIRCLE_NODE_INDEX/docs/index.html"
TEMPLATE="Hey @{{user.login}}, thank you for your pull request 🤗. The documentation from this branch can be viewed [here]($LINK). Please remember to update Typescript types if you changed API."

read -r -d '' DATA << EOM
{
  "pull_request": "$CIRCLE_PULL_REQUEST",
  "template": "$TEMPLATE",
  "test": {
    "type": "string",
    "data": "The documentation from this branch can be viewed"
  },
  "update": true
}
EOM

curl \
  -H "Content-Type: application/json" \
  -d "$DATA" \
  -X POST $URL
