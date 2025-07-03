import * as React from 'react';
import {
  I18nManager,
  StyleProp,
  StyleSheet,
  Text as NativeText,
  TextStyle,
} from 'react-native';

import AnimatedText from './AnimatedText';
import type { VariantProp } from './types';
import StyledText from './v2/StyledText';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';

export type Props<T> = React.ComponentProps<typeof NativeText> & {
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
  variant?: VariantProp<T>;
  children: React.ReactNode;
  theme?: ThemeProp;
  style?: StyleProp<TextStyle>;
};

export type TextRef = React.ForwardedRef<{
  setNativeProps(args: Object): void;
}>;

// @component-group Typography

/**
 * Typography component showing styles complied with passed `variant` prop and supported by the type system.
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
const Text = (
  { style, variant, theme: initialTheme, ...rest }: Props<string>,
  ref: TextRef
) => {
  const root = React.useRef<NativeText | null>(null);
  // FIXME: destructure it in TS 4.6+
  const theme = useInternalTheme(initialTheme);
  const writingDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

  if (theme.isV3 && variant) {
    let font = theme.fonts[variant];
    let textStyle = [font, style];

    if (
      React.isValidElement(rest.children) &&
      (rest.children.type === Component ||
        rest.children.type === AnimatedText ||
        rest.children.type === StyledText)
    ) {
      const { props } = rest.children as {
        props: { variant?: string; style?: StyleProp<TextStyle> };
      };

      // Context:   Some components have the built-in `Text` component with a predefined variant,
      //            that also accepts `children` as a `React.Node`. This can result in a situation,
      //            where another `Text` component is rendered within the built-in `Text` component.
      //            By doing that, we assume that user doesn't want to consume pre-defined font properties.
      // Case one:  Nested `Text` has different `variant` that specified in parent. For example:
      //              <Chip>
      //                <Text variant="displayMedium">Nested</Text>
      //              </Chip>
      // Solution:  To address the following scenario, the code below overrides the `variant`
      //            specified in a parent in favor of children's variant:
      if (props.variant) {
        font = theme.fonts[props.variant as VariantProp<typeof props.variant>];
        textStyle = [style, font];
      }

      // Case two:  Nested `Text` has specified `styles` which intefere
      //            with font properties, from the parent's `variant`. For example:
      //              <Chip>
      //                <Text style={{fontSize: 30}}>Nested</Text>
      //              </Chip>
      // Solution:  To address the following scenario, the code below overrides the
      //            parent's style with children's style:
      if (!props.variant) {
        textStyle = [style, props.style];
      }
    }

    if (typeof font !== 'object') {
      throw new Error(
        `Variant ${variant} was not provided properly. Valid variants are ${Object.keys(
          theme.fonts
        ).join(', ')}.`
      );
    }

    return (
      <NativeText
        ref={root}
        style={[
          styles.text,
          { writingDirection, color: theme.colors.onSurface },
          textStyle,
        ]}
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

type TextComponent<T> = (
  props: Props<T> & { ref?: React.RefObject<TextRef> }
) => JSX.Element;

const Component = forwardRef(Text) as TextComponent<never>;

export const customText = <T,>() => Component as unknown as TextComponent<T>;

export default Component;
