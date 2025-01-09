import * as React from 'react';
import {
  Animated,
  I18nManager,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';

import type { VariantProp } from './types';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

type Props<T> = React.ComponentPropsWithRef<typeof Animated.Text> & {
  /**
   * Variant defines appropriate text styles for type role and its size.
   * Available variants:
   *
   *  Display: `displayLarge`, `displayMedium`, `displaySmall`
   *
   *  Headline: `headlineLarge`, `headlineMedium`, `headlineSmall`
   *
   *  Title: `titleLarge`, `titleMedium`, `titleSmall`
   *
   *  Label:  `labelLarge`, `labelMedium`, `labelSmall`
   *
   *  Body: `bodyLarge`, `bodyMedium`, `bodySmall`
   */
  variant?: VariantProp<T>;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Animated text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
function AnimatedText({
  style,
  theme: themeOverrides,
  variant,
  ...rest
}: Props<never>) {
  const theme = useInternalTheme(themeOverrides);
  const writingDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

  if (theme.isV3 && variant) {
    const font = theme.fonts[variant];
    if (typeof font !== 'object') {
      throw new Error(
        `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
          theme.fonts
        ).join(', ')}.`
      );
    }

    return (
      <Animated.Text
        {...rest}
        style={[
          font,
          styles.text,
          { writingDirection, color: theme.colors.onSurface },
          style,
        ]}
      />
    );
  } else {
    const font = !theme.isV3 ? theme.fonts.regular : theme.fonts.bodyMedium;
    const textStyle = {
      ...font,
      color: theme.isV3 ? theme.colors.onSurface : theme.colors.text,
    };
    return (
      <Animated.Text
        {...rest}
        style={[
          styles.text,
          textStyle,
          {
            writingDirection,
          },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export const customAnimatedText = <T,>() =>
  AnimatedText as (props: Props<T>) => JSX.Element;

export default AnimatedText;
