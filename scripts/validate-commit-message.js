/* @flow */

const fs = require('fs');
const dedent = require('dedent');
const chalk = require('chalk');

const MAX_LENGTH = 72;
const MESSAGE_PATTERN = /^(?:fixup!\s*)?(\w*)(\(([\w$.*/-]*)\))?: (.*)$/;
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

const commit = process.env.HUSKY_GIT_PARAMS;

try {
  const message = fs.readFileSync(commit);

  let error;

  if (message.length > MAX_LENGTH) {
    error = `It should be less than ${chalk.blue(
      String(MAX_LENGTH)
    )} characters`;
  } else {
    const match = MESSAGE_PATTERN.exec(message);

    if (!match || !TYPES.includes(match[1])) {
      error = dedent`
        It should match the format '${chalk.blue('<type>: <subject>')}'

        Where ${chalk.blue('<type>')} is one of:
        ${TYPES.map(t => `- ${t}`).join('\n')}
      `;
    }
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.log(dedent`
      ${chalk.red('Invalid commit message:')} ${chalk.bold(message)}

      ${error}
    `);

    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (error) {
  process.exit(1);
}
