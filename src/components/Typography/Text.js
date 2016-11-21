/* @flow */

import React, {
  PureComponent,
  PropTypes,
} from 'react';
import { Text as NativeText } from 'react-native';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  style?: any;
  theme: Theme;
}

/**
 * Text component which follows settings from the theme
 */
class Text extends PureComponent<void, Props, void> {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    style: NativeText.propTypes.style,
  };

  _root: any;

  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  render() {
    const {
      style,
      theme,
    } = this.props;

    return (
      <NativeText
        {...this.props}
        ref={c => (this._root = c)}
        style={[ { fontFamily: theme.fonts.regular, color: theme.colors.text }, style ]}
      />
    );
  }
}

export default withTheme(Text);
