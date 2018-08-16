/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import PortalManager from './PortalManager';
import createReactContext, { type Context } from 'create-react-context';
import type { PortalProps } from './Portal';

type Props = {
  children: React.Node,
  style?: any,
};

type Operation =
  | { type: 'mount', key: number, props: PortalProps }
  | { type: 'update', key: number, props: PortalProps }
  | { type: 'unmount', key: number };

export type PortalMethods = {
  mount: (props: PortalProps) => number,
  update: (key: number, props: PortalProps) => void,
  unmount: (key: number) => void,
};

export const PortalContext: Context<PortalMethods> = createReactContext(
  (null: any)
);

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalHost extends React.Component<Props> {
  componentDidMount() {
    const manager = this._manager;
    const queue = this._queue;

    while (queue.length && manager) {
      const action = queue.pop();

      // eslint-disable-next-line default-case
      switch (action.type) {
        case 'mount':
          manager.mount(action.key, action.props);
          break;
        case 'update':
          manager.update(action.key, action.props);
          break;
        case 'unmount':
          manager.unmount(action.key);
          break;
      }
    }
  }

  _mount = (props: PortalProps) => {
    const key = this._nextKey++;

    if (this._manager) {
      this._manager.mount(key, props);
    } else {
      this._queue.push({ type: 'mount', key, props });
    }

    return key;
  };

  _update = (key: number, props: PortalProps) => {
    if (this._manager) {
      this._manager.update(key, props);
    } else {
      const op = { type: 'mount', key, props };
      const index = this._queue.findIndex(
        o => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );

      if (index > -1) {
        /* $FlowFixMe */
        this._queue[index] = op;
      } else {
        this._queue.push(op);
      }
    }
  };

  _unmount = (key: number) => {
    if (this._manager) {
      this._manager.unmount(key);
    } else {
      this._queue.push({ type: 'unmount', key });
    }
  };

  _setManager = (manager: ?Object) => {
    this._manager = manager;
  };

  _nextKey = 0;
  _queue: Operation[] = [];
  _manager: ?PortalManager;

  render() {
    return (
      <PortalContext.Provider
        value={{
          mount: this._mount,
          update: this._update,
          unmount: this._unmount,
        }}
      >
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <View style={styles.container} collapsable={false}>
          {this.props.children}
        </View>
        <PortalManager ref={this._setManager} />
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
