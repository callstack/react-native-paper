/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import type { PortalProps } from './Portal';

type Props = {
  children?: any,
  style?: any,
};

type State = {
  portals: Array<{
    key: number,
    props: PortalProps,
  }>,
};

export const manager = 'react-native-paper$portal-manager';

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class Portals extends PureComponent<void, Props, State> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    style: View.propTypes.style,
  };

  static childContextTypes = {
    [manager]: PropTypes.object,
  };

  state = {
    portals: [],
  };

  getChildContext() {
    return {
      [manager]: {
        mount: this._mountPortal,
        unmount: this._unmountPortal,
        update: this._updatePortal,
      },
    };
  }

  _nextId = 0;

  _mountPortal = (props: PortalProps) => {
    const portals = this.state.portals;
    this.setState({
      portals: portals.concat({ key: this._nextId, props }),
    });
    return this._nextId++;
  };

  _unmountPortal = (key: number) => {
    const portals = this.state.portals;
    this.setState({
      portals: portals.filter(item => item.key !== key),
    });
  };

  _updatePortal = (key: number, props: PortalProps) => {
    const portals = this.state.portals;
    this.setState({
      portals: portals.map(item => {
        if (item.key === key) {
          return { ...item, props };
        }
        return item;
      }),
    });
  };

  render() {
    const { portals } = this.state;
    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        {this.props.children}
        {portals
          .reduce((acc, curr) => {
            const { position = 0, children } = curr.props;
            let group = acc.find(it => it.position === position);
            if (group) {
              group = {
                position,
                items: group.items.concat([children]),
              };
              return acc.map(g => {
                if (group && g.position === position) {
                  return group;
                }
                return g;
              });
            } else {
              group = { position, items: [children] };
              return [...acc, group];
            }
          }, [])
          .map(({ position, items }) => (
            <View key={position} style={StyleSheet.absoluteFill}>
              {items}
            </View>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
