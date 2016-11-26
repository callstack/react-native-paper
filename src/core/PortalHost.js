/* @flow */

import React, {
  Component,
  isValidElement,
  PropTypes,
} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

type Props = {
  children?: any;
  style?: any;
}

type State = {
  portals: { [key: string]: ?React.Element<*> };
}

export const manager = 'react-native-paper$portal-manager';

export default class PortalHost extends Component<void, Props, State> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: View.propTypes.style,
  };

  static childContextTypes = {
    [manager]: PropTypes.object,
  };

  state = {
    portals: {},
  };

  getChildContext() {
    return {
      [manager]: {
        mount: this._mountPortal,
        unmount: this._unmountPortal,
      },
    };
  }

  _nextId = 0;

  _mountPortal = (portal: ?React.Element<*>) => {
    const { portals } = this.state;

    if (isValidElement(portal)) {
      this.setState({
        portals: {
          ...portals,
          [this._nextId]: portal,
        },
      });
      return this._nextId++;
    }

    return null;
  }

  _unmountPortal = (key: string) => {
    let { portals } = this.state;

    if (portals.hasOwnProperty(key)) {
      portals = { ...portals };
      delete portals[key];

      this.setState({
        portals,
      });
    }
  }

  render() {
    const { portals } = this.state;
    return (
      <View style={[ styles.container, this.props.style ]}>
        {this.props.children}
        <View style={StyleSheet.absoluteFill}>
          {Object.keys(portals).map(key =>
            portals[key]
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
