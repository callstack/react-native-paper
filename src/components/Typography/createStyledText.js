/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
} from 'react-native';

type Props = {
  children?: any;
  style?: any;
  theme?: any;
}

export default function createStyledText<T>(fontFamily: string, fontSize: number): ReactClass<T> {

  return class extends Component<void, Props, void> {
    static propTypes = {
      children: PropTypes.element.isRequired,
      theme: PropTypes.object,
      style: View.propTypes.style,
    }

    render() {
      const {
        theme,
        children,
        style,
      } = this.props;
      const color = theme ? theme.text : 'black';

      return (
        <Text
          style={[ { color, fontFamily, fontSize }, style ]}
          {...this.props}
        >
          {children}
        </Text>);
    }
  };
}
