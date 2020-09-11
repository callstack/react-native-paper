const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');

const SOURCE_FILES_PATTERN = './src/**/*.js';
const DESTINATION_DIR = './__ts-tests__';
const EXAMPLE_REGEX = /(## Usage\n \* ```js)([\S\s]*?)(```)/g;
const JS_EXT = '.js';
const TS_TEST_EXT = '.test.tsx';

const transformContent = (content) =>
  content
    .replace("'react-native-paper'", "'..'")
    .split('\n')
    .map((e) => e.slice(3))
    .join('\n');

const getFiles = () =>
  glob
    .sync(SOURCE_FILES_PATTERN)
    .map((filePath) => {
      const content = readFileSync(filePath, 'utf-8');
      const match = EXAMPLE_REGEX.exec(content);
      // JS regexp is stateful, you need to reset lastIndex each time
      EXAMPLE_REGEX.lastIndex = 0;
      return match
        ? {
            path: filePath,
            content: transformContent(match[2]),
          }
        : null;
    })
    .filter(Boolean);

const writeFiles = (files) => {
  mkdirSync(DESTINATION_DIR);

  files.forEach((f) =>
    writeFileSync(
      path.join(
        DESTINATION_DIR,
        `${path.basename(f.path, JS_EXT)}${TS_TEST_EXT}`
      ),
      f.content
    )
  );
};

rimraf.sync(DESTINATION_DIR);
writeFiles(getFiles());
