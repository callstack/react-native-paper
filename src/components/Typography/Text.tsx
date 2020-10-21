import * as React from 'react';
import { Text as NativeText, TextStyle, StyleProp } from 'react-native';
import type { SetPropAsOptional } from '../../types';
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
class Text extends React.Component<Props> {
  private root: NativeText | undefined | null;

  /**
   * @internal
   */
  setNativeProps(args: Object) {
    return this.root && this.root.setNativeProps(args);
  }

  render() {
    const { style, theme, ...rest } = this.props;

    return (
      <NativeText
        {...rest}
        ref={(c) => {
          this.root = c;
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
  }
}

// Set the theme to be optional as it should be provided through withTheme
export type TextProps = SetPropAsOptional<Props, 'theme'>;

export default withTheme(Text);
