/* @flow */

const fs = require('fs');
const util = require('util');

const MAX_LENGTH = 100;
const PATTERN = /^(?:fixup!\s*)?(\w*)(\(([\w$.*/-]*)\))?: (.*)$/;
const TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore',
  'revert',
  'BREAKING',
];

function printError(...args) {
  // eslint-disable-next-line no-console
  console.error(`INVALID COMMIT MESSSAGE: ${util.format.apply(null, args)}`);
}

function validateMessage(message) {
  if (message.length > MAX_LENGTH) {
    printError('is longer than %d characters!', MAX_LENGTH);
    return false;
  }

  const match = PATTERN.exec(message);

  if (!match) {
    printError(`does not match "<type>: <subject>"! was: ${message}`);
    return false;
  }
  const type = match[1];

  if (!TYPES.includes(type)) {
    printError('"%s" is not an allowed type!', type);
    return false;
  }

  return true;
}

function firstLineFromBuffer(buffer) {
  return buffer
    .toString()
    .split('\n')
    .shift();
}

const commitMsgFile = process.argv[2];

try {
  const buffer = fs.readFileSync(commitMsgFile);
  const msg = firstLineFromBuffer(buffer);
  if (!validateMessage(msg)) {
    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (error) {
  process.exit(1);
}
