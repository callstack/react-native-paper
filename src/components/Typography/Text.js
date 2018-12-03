/* @flow */

import * as React from 'react';
import { Text as NativeText, I18nManager } from 'react-native';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof NativeText> & {
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://facebook.github.io/react-native/docs/text.html#props
 */
class Text extends React.Component<Props> {
  _root: ?NativeText;

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this._root && this._root.setNativeProps(...args);
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
            fontFamily: theme.fonts.regular,
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
