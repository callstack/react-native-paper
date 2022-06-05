#!/bin/bash

URL="https://callstack-github-bot.herokuapp.com/comment"
LINK="https://output.circle-artifacts.com/output/job/$CIRCLE_WORKFLOW_JOB_ID/artifacts/$CIRCLE_NODE_INDEX/docs/index.html"
TEMPLATE="Hey @{{user.login}}, thank you for your pull request 🤗. The documentation from this branch can be viewed [here]($LINK)."

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
