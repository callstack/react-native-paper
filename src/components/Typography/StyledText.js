/* @flow */

import color from 'color';
import * as React from 'react';
import { I18nManager } from 'react-native';
import Text from './Text';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof Text> & {
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
    const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

    return (
      <Text
        {...rest}
        style={[
          { color: textColor, fontFamily, textAlign: 'left', writingDirection },
          style,
          this.props.style,
        ]}
      />
    );
  }
}

export default withTheme(StyledText);
