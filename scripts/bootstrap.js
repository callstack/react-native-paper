const child_process = require('child_process');

const args = process.argv.slice(2);
const options = {
  cwd: process.cwd(),
  env: process.env,
  stdio: [process.stdin, process.stdout, process.stderr],
  encoding: 'utf-8',
};

if (args.length) {
  child_process.spawnSync('yarn', args, options);
} else {
  child_process.spawnSync('yarn', ['bootstrap'], options);
}
