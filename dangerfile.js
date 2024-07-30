/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { dangerReassure } from 'reassure';

dangerReassure({
  inputFilePath: path.join(__dirname, './.reassure/output.md'),
});
