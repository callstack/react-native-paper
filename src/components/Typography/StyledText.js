/* @flow */

import color from 'color';
import React, {
  PureComponent,
  PropTypes,
} from 'react';
import Text from './Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  alpha: number;
  family: 'regular' | 'medium' | 'light' | 'thin';
  style?: any;
  theme: Theme;
}

class StyledText extends PureComponent<void, Props, void> {
  static propTypes = {
    alpha: PropTypes.number.isRequired,
    family: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    style: Text.propTypes.style,
  }

  render() {
    const { theme, alpha, family, style, ...rest } = this.props;
    const textColor = color(theme.colors.text).alpha(alpha).rgbaString();
    const fontFamily = theme.fonts[family];

    return (
      <Text
        {...rest}
        style={[ { color: textColor, fontFamily }, style, this.props.style ]}
      />
    );
  }
}

export default withTheme(StyledText);
