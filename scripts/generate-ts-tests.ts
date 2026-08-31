import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join } from 'node:path';

type SourceFile = {
  path: string;
  content: string;
};

const SOURCE_DIR = './src';
const DESTINATION_DIR = './__ts-tests__';
const EXAMPLE_REGEX = /(## Usage\n \* ```js)([\S\s]*?)(```)/g;
const JS_EXT = '.js';
const TS_TEST_EXT = '.test.tsx';

const transformContent = (content: string) =>
  content
    .replace("'react-native-paper'", "'..'")
    .split('\n')
    .map((e) => e.slice(3))
    .join('\n');

const getSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getSourceFiles(filePath);
    }

    return entry.isFile() && filePath.endsWith(JS_EXT) ? [filePath] : [];
  });

const getFiles = () =>
  getSourceFiles(SOURCE_DIR)
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
    .filter((file): file is SourceFile => file !== null);

const writeFiles = (files: SourceFile[]) => {
  mkdirSync(DESTINATION_DIR);

  files.forEach((f) =>
    writeFileSync(
      join(DESTINATION_DIR, `${basename(f.path, JS_EXT)}${TS_TEST_EXT}`),
      f.content
    )
  );
};

rmSync(DESTINATION_DIR, { recursive: true, force: true });
writeFiles(getFiles());
