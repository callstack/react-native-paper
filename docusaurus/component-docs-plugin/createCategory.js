const fs = require('fs');
const path = require('path');

const { docsRootDir } = require('./paths');

function createCategory(label, dir = '.') {
  const categoryJSON = JSON.stringify(
    {
      label,
      link: {
        type: 'generated-index',
      },
    },
    undefined,
    2
  );
  const docsCategoryDir = path.join(docsRootDir, dir);
  if (!fs.existsSync(docsCategoryDir)) {
    fs.mkdirSync(docsCategoryDir);
  }
  fs.writeFile(
    path.join(docsCategoryDir, `_category_.json`),
    categoryJSON,
    () => {}
  );
}

module.exports = createCategory;
