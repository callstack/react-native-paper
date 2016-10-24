/* @flow */

import withTheme from '../core/withTheme';
import fonts from '../styles/fonts';
import withTextProps from './withTextProps';

const Subheading = withTextProps(fonts.regular, 16);

export default withTheme(Subheading);
