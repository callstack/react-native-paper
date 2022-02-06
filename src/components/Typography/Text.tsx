import * as React from 'react';
import {
  Text as NativeText,
  TextStyle,
  StyleProp,
  StyleSheet,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../core/theming';
import { Font, MD3TypescaleKey, ThemeProp } from '../../types';

type Props = React.ComponentProps<typeof NativeText> & {
  /**
   * @supported Available in v3.x with theme version 3
   *
   * Variant defines appropriate text styles for type role and its size.
   * Available variants:
   *
   *  Display: `display-large`, `display-small`, `display-small`
   *
   *  Headline: `headline-large`, `headline-medium`, `headline-small`
   *
   *  Title: `title-large`, `title-medium`, `title-small`
   *
   *  Label:  `label-large`, `label-medium`, `label-small`
   *
   *  Body: `body-large`, `body-medium`, `body-small`
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
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <>
 *     <Text variant="display-large">Display Large</Text>
 *     <Text variant="display-medium">Display Medium</Text>
 *     <Text variant="display-small">Display small</Text>
 *
 *     <Text variant="headline-large">Headline Large</Text>
 *     <Text variant="headline-medium">Headline Medium</Text>
 *     <Text variant="headline-small">Headline Small</Text>
 *
 *     <Text variant="title-large">Title Large</Text>
 *     <Text variant="title-medium">Title Medium</Text>
 *     <Text variant="title-small">Title Small</Text>
 *
 *     <Text variant="body-large">Body Large</Text>
 *     <Text variant="body-medium">Body Medium</Text>
 *     <Text variant="body-small">Body Small</Text>
 *
 *     <Text variant="label-large">Label Large</Text>
 *     <Text variant="label-medium">Label Medium</Text>
 *     <Text variant="label-small">Label Small</Text>
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
  const theme = useTheme(initialTheme);
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

  if (theme.isV3 && variant) {
    const stylesByVariant = Object.keys(MD3TypescaleKey).reduce(
      (acc, key) => {
        const { size, weight, lineHeight, tracking } =
          theme.typescale[key as keyof typeof MD3TypescaleKey];

        return {
          ...acc,
          [key]: {
            fontSize: size,
            fontWeight: weight,
            lineHeight: lineHeight,
            letterSpacing: tracking,
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
    return (
      <NativeText
        {...rest}
        ref={root}
        style={[
          {
            ...theme.fonts?.regular,
            color: theme.isV3 ? theme.colors?.onSurface : theme.colors.text,
          },
          styles.text,
          style,
        ]}
      />
    );
  }
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default React.forwardRef(Text);
