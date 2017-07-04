const fs = require('fs');
const util = require('util');

const MAX_LENGTH = 100;
const PATTERN = /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/;
const TYPES = {
  feat: true,
  fix: true,
  docs: true,
  style: true,
  refactor: true,
  perf: true,
  test: true,
  chore: true,
  revert: true,
};

function printError() {
  console.error('INVALID COMMIT MSG: ' + util.format.apply(null, arguments));
}

function validateMessage(message) {
  if (message.length > MAX_LENGTH) {
    printError('is longer than %d characters !', MAX_LENGTH);
    return false;
  }

  const match = PATTERN.exec(message);

  if (!match) {
    printError('does not match "<type>(<scope>): <subject>" ! was: ' + message);
    return false;
  }
  const type = match[1];

  if (!TYPES.hasOwnProperty(type)) {
    printError('"%s" is not allowed type !', type);
    return false;
  }

  return true;
}

function firstLineFromBuffer(buffer) {
  return buffer.toString().split('\n').shift();
}

const commitMsgFile = process.argv[2];

fs.readFile(commitMsgFile, function(err, buffer) {
  const msg = firstLineFromBuffer(buffer);

  if (!validateMessage(msg)) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});
