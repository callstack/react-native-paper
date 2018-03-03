/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PortalProps } from './Portal';

type State = {
  portals: Array<{
    key: number,
    props: PortalProps,
  }>,
};

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<{}, State> {
  state = {
    portals: [],
  };

  mount = (key: number, props: PortalProps) => {
    this.setState(state => ({
      portals: [...state.portals, { key, props }],
    }));
  };

  update = (key: number, props: PortalProps) =>
    this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return { ...item, props };
        }
        return item;
      }),
    }));

  unmount = (key: number) =>
    this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key),
    }));

  render() {
    return this.state.portals
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
        }
        group = { position, items: [children] };
        return [...acc, group];
      }, [])
      .map(({ position, items }) => (
        <View
          key={position}
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
        >
          {items}
        </View>
      ));
  }
}
