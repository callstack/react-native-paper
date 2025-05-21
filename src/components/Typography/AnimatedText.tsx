import * as React from 'react';
import {
  Animated,
  I18nManager,
  StyleProp,
  StyleSheet,
  TextStyle,
  Text,
} from 'react-native';

import type { VariantProp } from './types';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';

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
const AnimatedText = forwardRef<Text & HTMLElement, Props<never>>(
  function AnimatedText(
    { style, theme: themeOverrides, variant, ...rest },
    ref
  ) {
    const {
      fonts,
      colors: { onSurface },
    } = useInternalTheme(themeOverrides);
    const writingDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

    if (variant) {
      const font = fonts[variant];
      if (typeof font !== 'object') {
        throw new Error(
          `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
            fonts
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
            { writingDirection, color: onSurface },
            style,
          ]}
        />
      );
    } else {
      const textStyle = {
        ...fonts.bodyMedium,
        color: onSurface,
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
);

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export const customAnimatedText = <T,>() =>
  AnimatedText as (props: Props<T>) => React.JSX.Element;

export default AnimatedText;
