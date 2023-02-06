import * as React from 'react';
import {
  I18nManager,
  StyleProp,
  StyleSheet,
  Text as NativeText,
  TextStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import { Font, MD3TypescaleKey, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';

export type Props = React.ComponentProps<typeof NativeText> & {
  /**
   * @supported Available in v5.x with theme version 3
   *
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
  children: React.ReactNode;
  theme?: ThemeProp;
  style?: StyleProp<TextStyle>;
};

// @component-group Typography

/**
 * Typography component showing styles complied with passed `variant` prop and supported by the type system.
 *
 * <div class="screenshots">
 *   <img class="small" src="screenshots/typography.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <>
 *     <Text variant="displayLarge">Display Large</Text>
 *     <Text variant="displayMedium">Display Medium</Text>
 *     <Text variant="displaySmall">Display small</Text>
 *
 *     <Text variant="headlineLarge">Headline Large</Text>
 *     <Text variant="headlineMedium">Headline Medium</Text>
 *     <Text variant="headlineSmall">Headline Small</Text>
 *
 *     <Text variant="titleLarge">Title Large</Text>
 *     <Text variant="titleMedium">Title Medium</Text>
 *     <Text variant="titleSmall">Title Small</Text>
 *
 *     <Text variant="bodyLarge">Body Large</Text>
 *     <Text variant="bodyMedium">Body Medium</Text>
 *     <Text variant="bodySmall">Body Small</Text>
 *
 *     <Text variant="labelLarge">Label Large</Text>
 *     <Text variant="labelMedium">Label Medium</Text>
 *     <Text variant="labelSmall">Label Small</Text>
 *  </>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */

const Text: React.ForwardRefRenderFunction<{}, Props> = (
  { style, variant, theme: initialTheme, ...rest }: Props,
  ref
) => {
  const root = React.useRef<NativeText | null>(null);
  // FIXME: destructure it in TS 4.6+
  const theme = useInternalTheme(initialTheme);
  const writingDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

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
            lineHeight,
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
      <NativeText
        ref={root}
        style={[styleForVariant, styles.text, { writingDirection }, style]}
        {...rest}
      />
    );
  } else {
    const font = theme.isV3 ? theme.fonts.default : theme.fonts?.regular;
    const textStyle = {
      ...font,
      color: theme.isV3 ? theme.colors?.onSurface : theme.colors.text,
    };
    return (
      <NativeText
        {...rest}
        ref={root}
        style={[styles.text, textStyle, { writingDirection }, style]}
      />
    );
  }
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default forwardRef(Text);
