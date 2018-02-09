/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import type { PortalProps } from './Portal';

type Props = {
  children: React.Node,
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
export default class Portals extends React.Component<Props, State> {
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
    const key = this._nextId++;
    this.setState(state => ({
      portals: [...state.portals, { key, props }],
    }));
    return key;
  };

  _unmountPortal = (key: number) =>
    this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key),
    }));

  _updatePortal = (key: number, props: PortalProps) =>
    this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return { ...item, props };
        }
        return item;
      }),
    }));

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
