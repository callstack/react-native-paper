/* @flow */

import withTheme from '../core/withTheme';
import fonts from '../styles/fonts';
import withTextProps from './withTextProps';

const Text = withTextProps(fonts.regular, 16);

export default withTheme(Text);
