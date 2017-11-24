/* @flow */

import color from 'color';
import * as React from 'react';
import Text from './Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
  alpha: number,
  family: 'regular' | 'medium' | 'light' | 'thin',
  style?: any,
  theme: Theme,
};

class StyledText extends React.Component<Props> {
  render() {
    const { theme, alpha, family, style, ...rest } = this.props;
    const textColor = color(theme.colors.text)
      .alpha(alpha)
      .rgb()
      .string();
    const fontFamily = theme.fonts[family];

    return (
      <Text
        {...rest}
        style={[{ color: textColor, fontFamily }, style, this.props.style]}
      />
    );
  }
}

export default withTheme(StyledText);
