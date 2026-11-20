import * as React from 'react';
import type { ReactNode } from 'react';

import Animated from 'react-native-reanimated';

import { useIsNestedText, markChildrenAsNested } from './NestedTextContext';
import type { VariantProp } from './types';
import { getTextAlignStyle } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';

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
  const alignStyle = getTextAlignStyle(writingDirection);
  // Nested text inherits the parent's style unless it has its own theme
  const inheritsStyle = useIsNestedText() && !themeOverrides;

  let element: React.ReactElement;

  if (variant) {
    const font = theme.fonts[variant];
    if (typeof font !== 'object') {
      throw new Error(
        `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
          theme.fonts
        ).join(', ')}.`
      );
    }

    element = (
      <Animated.Text
        ref={ref}
        {...rest}
        style={
          inheritsStyle
            ? [font, style]
            : [
                font,
                alignStyle,
                { writingDirection, color: theme.colors.onSurface },
                style,
              ]
        }
      />
    );
  } else if (inheritsStyle) {
    element = <Animated.Text ref={ref} {...rest} style={style} />;
  } else {
    const font = theme.fonts.bodyMedium;
    const textStyle = {
      ...font,
      color: theme.colors.onSurface,
    };
    element = (
      <Animated.Text
        ref={ref}
        {...rest}
        style={[
          alignStyle,
          textStyle,
          {
            writingDirection,
          },
          style,
        ]}
      />
    );
  }

  return markChildrenAsNested(element, rest.children);
}

export const customAnimatedText = <T,>() =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  AnimatedText as (props: Props<T>) => ReactNode;

export default AnimatedText;
