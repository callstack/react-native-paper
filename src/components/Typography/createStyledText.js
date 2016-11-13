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
  style?: any;
  theme: Theme;
}

type TextStyle = {
  fontSize: number;
  lineHeight: number;
  alpha: number;
  family: 'regular' | 'medium' | 'light' | 'thin';
}

export default function createStyledText<T>(name: string, textStyle: TextStyle): ReactClass<T> {
  const { alpha, family, ...style } = textStyle;

  class StyledText extends PureComponent<void, Props, void> {
    static displayName = name;
    static propTypes = {
      theme: PropTypes.object.isRequired,
      style: Text.propTypes.style,
    }

    render() {
      const { theme } = this.props;
      const textColor = color(theme.colors.text).alpha(alpha).rgbaString();
      const fontFamily = theme.fonts[family];

      return (
        <Text
          {...this.props}
          style={[ { color: textColor, fontFamily }, style, this.props.style ]}
        />
      );
    }
  }

  return withTheme(StyledText);
}
