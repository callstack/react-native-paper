const fs = require('fs');

const { docsRootDir } = require('./paths');

function clean() {
  fs.rmSync(docsRootDir, { recursive: true, force: true });
}

module.exports = clean;
