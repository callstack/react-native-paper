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

export default function withTextProps<T>(fontFamily: string, fontSize: number): ReactClass<T> {

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

      return (
        <Text
          style={[ { color: theme.primaryText, fontFamily, fontSize }, style ]}
          {...this.props}
        >
          {children}
        </Text>);
    }
  };
}
