/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import { Text as NativeText } from 'react-native';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  style?: any;
  theme: Theme;
}

class Text extends Component<void, Props, void> {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    style: NativeText.propTypes.style,
  };

  render() {
    const {
      style,
      theme,
    } = this.props;

    return (
      <NativeText
        {...this.props}
        style={[ { fontFamily: theme.fonts.regular, color: theme.colors.text }, style ]}
      />
    );
  }
}

export default withTheme(Text);
