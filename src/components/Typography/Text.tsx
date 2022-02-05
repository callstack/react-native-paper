import * as React from 'react';
import {
  Text as NativeText,
  TextStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../core/theming';
import { Font, MD3Token, MD3TypescaleKey, Theme } from '../../types';

type Props = React.ComponentProps<typeof NativeText> & {
  style?: StyleProp<TextStyle>;
  variant?: keyof typeof MD3TypescaleKey;
  theme: Theme;
};

// @component-group Typography

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */

const Text: React.ForwardRefRenderFunction<{}, Props> = (
  { style, variant, theme, ...rest },
  ref
) => {
  const root = React.useRef<NativeText | null>(null);
  const { isV3, colors, fonts, getToken } = useTheme(theme);

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

  if (isV3 && variant) {
    const stylesByVariant = Object.keys(MD3TypescaleKey).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          fontSize: getToken(`md.sys.typescale.${key}.size` as MD3Token),
          fontWeight: getToken(`md.sys.typescale.${key}.weight` as MD3Token),
          lineHeight: getToken(
            `md.sys.typescale.${key}.line-height` as MD3Token
          ),
          letterSpacing: getToken(
            `md.sys.typescale.${key}.tracking` as MD3Token
          ),
          color: getToken('md.sys.color.on-surface'),
        },
      }),
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
          ...fonts?.regular,
          color: colors?.text,
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
