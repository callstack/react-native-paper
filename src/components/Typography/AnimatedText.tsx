import * as React from 'react';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import type { VariantProp } from './types';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

type AnimatedTextProps = React.ComponentProps<typeof Animated.Text>;

type Props<T> = AnimatedTextProps & {
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
  style?: AnimatedTextProps['style'];
  ref?: AnimatedTextProps['ref'];
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
  ref,
  ...rest
}: Props<never>) {
  const theme = useInternalTheme(themeOverrides);
  const { direction: writingDirection } = useLocale();

  if (variant) {
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
        ref={ref}
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
    const font = theme.fonts.bodyMedium;
    const textStyle = {
      ...font,
      color: theme.colors.onSurface,
    };
    return (
      <Animated.Text
        ref={ref}
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
  AnimatedText as (props: Props<T>) => ReactNode;

export default AnimatedText;
