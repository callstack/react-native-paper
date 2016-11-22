/* @flow */

import React, {
  Children,
  Component,
  isValidElement,
  PropTypes,
} from 'react';
import {
  View,
} from 'react-native';

type Props = {
  children?: any;
}

type State = {
  portals: Array;
}

export default class PortalProvider extends Component<void, Props, State> {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static state = {
    portals: {},
  };

  static childContextTypes = {
    portalManager: PropTypes.object,
  };

  getChildContext() {
    return {
      portalManager: {
        mount: this.mountPortal,
        unmount: this.unmountPortal,
      },
    };
  }

  mountPortal(portal) {
    const { portals } = this.state;

    if (isValidElement(portal)) {
      const key = Object.keys(portals).length;

      this.setState({
        portals: Object.assign({}, portals, {
          [key]: portal,
        }),
      });

      return key;
    }

    return null;
  }

  unmountPortal(key) {
    let { portals } = this.state;

    if (portals.hasOwnProperty(key)) {
      portals = Object.assign({}, portals);
      delete portals[key];

      this.setState({
        portals,
      });
    }
  }

  renderPortals() {
    const { portals } = this.state;

    return Object.keys(portals).map((key) => portals[key]);
  }

  render() {
    return (
      <View>
        {Children.only(this.props.children)}
        {this.renderPortals()}
      </View>
    );
  }
}
