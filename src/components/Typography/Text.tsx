import * as React from 'react';
import { Text as NativeText, TextStyle, StyleProp } from 'react-native';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = React.ComponentProps<typeof NativeText> & {
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: Theme;
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
        ref={c => {
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

export default withTheme(Text);
