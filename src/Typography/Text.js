/* @flow */

import withTheme from '../core/withTheme';
import fonts from '../styles/fonts';
import createStyledText from './createStyledText';

const Text = createStyledText(fonts.regular, 16);

export default withTheme(Text);
