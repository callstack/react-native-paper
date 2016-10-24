/* @flow */

import withTheme from '../core/withTheme';
import fonts from '../styles/fonts';
import createStyledText from './createStyledText';

const Subheading = createStyledText(fonts.regular, 14);

export default withTheme(Subheading);
