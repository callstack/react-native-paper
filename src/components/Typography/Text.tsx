import * as React from 'react';
import {
  Text as NativeText,
  TextStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../core/theming';
import { Font, MD3TypescaleKey, ThemeProp } from '../../types';

type Props = React.ComponentProps<typeof NativeText> & {
  style?: StyleProp<TextStyle>;
  variant?: keyof typeof MD3TypescaleKey;
  theme?: ThemeProp;
};

// @component-group Typography

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */

const Text: React.ForwardRefRenderFunction<{}, Props> = (
  { style, variant, theme: initialTheme, ...rest },
  ref
) => {
  const root = React.useRef<NativeText | null>(null);
  // FIXME: destructure it in TS 4.6+
  const theme = useTheme(initialTheme);

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

    return <NativeText ref={root} style={[styleForVariant, style]} {...rest} />;
  }

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
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default React.forwardRef(Text);
