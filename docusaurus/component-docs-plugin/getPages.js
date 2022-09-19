const fs = require('fs');
const path = require('path');

const { libsRootDir } = require('./paths');

// This function taken from https://github.com/callstack/react-native-paper/blob/main/docs/component-docs.config.js#L38.
function getPages() {
  const components = fs
    .readFileSync(path.join(libsRootDir, 'index.tsx'))
    .toString()
    .split('\n')
    .map((line) => line.split(' ').pop().replace(/('|;)/g, ''))
    .filter((line) => line.startsWith('./components/'))
    .filter((line) => !line.includes('v2'))
    .map((line) => {
      try {
        const file = require.resolve(path.join(libsRootDir, line + '.tsx'));
        if (/\/index\.(js|tsx?)$/.test(file)) {
          const matches = fs
            .readFileSync(file)
            .toString()
            .match(/export \{ default \} from .+/);
          if (matches && matches.length) {
            const name = matches[0].split(' ').pop().replace(/('|;)/g, '');
            return require.resolve(path.join(libsRootDir, line, name + '.tsx'));
          }
        }
        return file;
      } catch (err) {
        return;
      }
    })
    .filter((file) => typeof file !== 'undefined')
    .reduce((acc, file) => {
      const content = fs.readFileSync(file).toString();
      const groupMatch = /\/\/ @component-group (\w+)/gm.exec(content);
      const group = groupMatch ? groupMatch[1] : undefined;

      if (/import \* as React/.test(content)) {
        acc.push({ file, group });
      }

      const match = content.match(/\/\/ @component (.+\/\w+\.(js|tsx?))/gm);

      if (match && match.length) {
        const componentFiles = match.map((line) => {
          const fileName = line.split(' ')[2];
          return {
            group,
            file: require.resolve(
              path.join(file.split('/').slice(0, -1).join('/'), fileName)
            ),
          };
        });

        acc.push(...componentFiles);
      }

      return acc;
    }, [])
    .filter(
      (info, index, self) =>
        index === self.findIndex((other) => info.file === other.file)
    )
    .sort((a, b) => {
      const nameA = a.file.split('/').pop();
      const nameB = b.file.split('/').pop();
      return nameA.localeCompare(nameB);
    })
    .sort((a, b) => {
      const nameA = (a.group || a.file).split('/').pop();
      const nameB = (b.group || b.file).split('/').pop();
      return nameA.localeCompare(nameB);
    })
    .map((info) => ({ ...info, type: 'component' }));

  return [...components];
}

module.exports = getPages;
