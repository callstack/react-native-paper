/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text as NativeText } from 'react-native';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  style?: any,
  theme: Theme,
};

/**
 * Text component which follows settings from the theme
 *
 * @extends Text props https://facebook.github.io/react-native/docs/text.html#props
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
    const { style, theme } = this.props;

    return (
      <NativeText
        {...this.props}
        ref={c => (this._root = c)}
        style={[
          { fontFamily: theme.fonts.regular, color: theme.colors.text },
          style,
        ]}
      />
    );
  }
}

export default withTheme(Text);
