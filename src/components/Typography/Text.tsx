import * as React from 'react';
import { Text as NativeText, TextStyle, StyleProp } from 'react-native';
import { withTheme } from '../../core/theming';

type Props = React.ComponentProps<typeof NativeText> & {
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

// @component-group Typography

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://facebook.github.io/react-native/docs/text.html#props
 */
const Text: React.RefForwardingComponent<{}, Props> = (
  { style, theme, ...rest }: Props,
  ref
) => {
  let { current: root } = React.useRef<NativeText | undefined | null>();

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root?.setNativeProps(args),
  }));

  return (
    <NativeText
      {...rest}
      ref={(c) => {
        root = c;
      }}
      style={[
        {
          ...theme.fonts.regular,
          color: theme.colors.text,
          textAlign: 'left',
        },
        style,
      ]}
    />
  );
};

export default withTheme(React.forwardRef(Text));
