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

type Group = {
  key: number,
  elevation?: number,
  items: React.Node[],
};

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<{}, State> {
  state: State = {
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
      .reduce((acc: Group[], curr) => {
        const { elevation, children } = curr.props;

        let group: ?Group = acc.find(it => it.elevation === elevation);

        if (group && typeof elevation === 'number') {
          group = {
            key: elevation,
            elevation,
            items: [
              ...group.items,
              React.cloneElement(children, { key: curr.key }),
            ],
          };
          return acc.map(g => {
            if (group && g.elevation === elevation) {
              return group;
            }
            return g;
          });
        }
        group = {
          key: typeof elevation === 'undefined' ? curr.key : elevation,
          elevation,
          items: [React.cloneElement(children, { key: curr.key })],
        };
        return [...acc, group];
      }, [])
      .map(({ key, items }) => (
        <View
          key={key}
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
        >
          {items}
        </View>
      ));
  }
}
