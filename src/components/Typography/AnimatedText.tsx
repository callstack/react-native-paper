import * as React from 'react';
import { Animated, TextStyle, I18nManager, StyleProp } from 'react-native';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = React.ComponentProps<typeof Animated.Text> & {
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://facebook.github.io/react-native/docs/text.html#props
 */
function AnimatedText({ style, theme, ...rest }: Props) {
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  return (
    <Animated.Text
      {...rest}
      style={[
        {
          ...theme.fonts.regular,
          color: theme.colors.text,
          textAlign: 'left',
          writingDirection,
        },
        style,
      ]}
    />
  );
}

export default withTheme(AnimatedText);
