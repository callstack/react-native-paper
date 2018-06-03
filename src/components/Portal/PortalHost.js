/* @flow */

import * as React from 'react';
import PortalManager from './PortalManager';
import createReactContext, { type Context } from 'create-react-context';

type Props = {
  children: React.Node,
};

type Operation =
  | { type: 'mount', key: number, children: React.Node }
  | { type: 'update', key: number, children: React.Node }
  | { type: 'unmount', key: number };

export type PortalMethods = {
  mount: (children: React.Node) => number,
  update: (key: number, children: React.Node) => void,
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
          manager.mount(action.key, action.children);
          break;
        case 'update':
          manager.update(action.key, action.children);
          break;
        case 'unmount':
          manager.unmount(action.key);
          break;
      }
    }
  }

  _mount = (children: React.Node) => {
    const key = this._nextKey++;

    if (this._manager) {
      this._manager.mount(key, children);
    } else {
      this._queue.push({ type: 'mount', key, children });
    }

    return key;
  };

  _update = (key: number, children: React.Node) => {
    if (this._manager) {
      this._manager.update(key, children);
    } else {
      const op = { type: 'mount', key, children };
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
        {this.props.children}
        <PortalManager
          ref={c => {
            this._manager = c;
          }}
        />
      </PortalContext.Provider>
    );
  }
}
