/* @flow */

import * as React from 'react';
import { Text as NativeText } from 'react-native';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
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
  _root: NativeText;

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  render() {
    const { style, theme } = this.props;

    return (
      <NativeText
        {...this.props}
        ref={c => {
          this._root = c;
        }}
        style={[
          { fontFamily: theme.fonts.regular, color: theme.colors.text },
          style,
        ]}
      />
    );
  }
}

export default withTheme(Text);
