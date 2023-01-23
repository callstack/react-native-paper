import * as React from 'react';
import { Animated, I18nManager, StyleSheet, TextStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import { Font, ThemeProp, MD3TypescaleKey } from '../../types';

type Props = React.ComponentPropsWithRef<typeof Animated.Text> & {
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
  variant?: keyof typeof MD3TypescaleKey;
  style?: TextStyle;
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
}: Props) {
  const theme = useInternalTheme(themeOverrides);
  const writingDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

  if (theme.isV3 && variant) {
    const stylesByVariant = Object.keys(MD3TypescaleKey).reduce(
      (acc, key) => {
        const { fontSize, fontWeight, lineHeight, letterSpacing, fontFamily } =
          theme.fonts[key as keyof typeof MD3TypescaleKey];

        return {
          ...acc,
          [key]: {
            fontFamily,
            fontSize,
            fontWeight,
            lineHeight: lineHeight,
            letterSpacing,
            color: theme.colors.onSurface,
          },
        };
      },
      {} as {
        [key in MD3TypescaleKey]: {
          fontSize: number;
          fontWeight: Font['fontWeight'];
          lineHeight: number;
          letterSpacing: number;
        };
      }
    );

    const styleForVariant = stylesByVariant[variant];

    return (
      <Animated.Text
        {...rest}
        style={[styleForVariant, styles.text, { writingDirection }, style]}
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

export default AnimatedText;
