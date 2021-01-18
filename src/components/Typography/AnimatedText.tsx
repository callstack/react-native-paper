import * as React from 'react';
import { Animated, TextStyle, I18nManager, StyleProp } from 'react-native';
import { withTheme } from '../../core/theming';

type Props = React.ComponentPropsWithRef<typeof Animated.Text> & {
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
function AnimatedText({ style, theme, ...rest }: Props) {
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  return (
    //@ts-ignore
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
