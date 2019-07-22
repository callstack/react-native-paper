import * as React from 'react';
import {
  Text as NativeText,
  TextStyle,
  I18nManager,
  StyleProp,
} from 'react-native';
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
  _root: NativeText | undefined | null;

  /**
   * @internal
   */
  setNativeProps(args: Object) {
    return this._root && this._root.setNativeProps(args);
  }

  render() {
    const { style, theme, ...rest } = this.props;
    const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

    return (
      <NativeText
        {...rest}
        ref={c => {
          this._root = c;
        }}
        style={[
          {
            ...theme.fonts.regular,
            color: theme.colors.text,
            textAlign: 'left',
            writingDirection,
          },
          style,
        ]}
      />
    );
  }
}

export default withTheme(Text);
