import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import PortalManager from './PortalManager';

type Props = {
  children: React.ReactNode;
};
type State = {
  portalVisibility: { [key in number]: boolean };
};

type Operation = { isFocused?: boolean } & (
  | {
      type: 'mount';
      key: number;
      children: React.ReactNode;
    }
  | {
      type: 'update';
      key: number;
      children: React.ReactNode;
    }
  | { type: 'unmount'; key: number }
);

export type PortalMethods = {
  mount: (children: React.ReactNode, isFocused: boolean) => number;
  update: (key: number, children: React.ReactNode, isFocused: boolean) => void;
  unmount: (key: number) => void;
};

export const PortalContext = React.createContext<PortalMethods>(null as any);

const updateVisibilityForKey = (key: number, isFocused: boolean) => ({
  portalVisibility,
}: Pick<State, 'portalVisibility'>): Pick<State, 'portalVisibility'> => ({
  portalVisibility: isFocused
    ? { ...portalVisibility, [key]: true } // If it's focused, set the key to true
    : portalVisibility[key] === undefined //
    ? { ...portalVisibility } // If not focused and key doesn't have a value, just return current object
    : Object.keys(portalVisibility).reduce((acc, keyIterator) => {
        const keyIndex = parseInt(keyIterator);
        // If not focused but key already has a value, remove the key
        if (keyIndex !== key) {
          acc[keyIndex] = portalVisibility[keyIndex];
        }
        return acc;
      }, {} as { [key in number]: boolean }),
});

/**
 * Portal host renders all of its children `Portal` elements.
 * For example, you can wrap a screen in `Portal.Host` to render items above the screen.
 * If you're using the `Provider` component, it already includes `Portal.Host`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native';
 * import { Portal } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Portal.Host>
 *     <Text>Content of the app</Text>
 *   </Portal.Host>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * Here any `Portal` elements under `<App />` are rendered alongside `<App />` and will appear above `<App />` like a `Modal`.
 */
export default class PortalHost extends React.Component<Props, State> {
  static displayName = 'Portal.Host';
  state: State = { portalVisibility: {} };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props !== nextProps ||
      Object.values(this.state.portalVisibility).some(Boolean) !==
        Object.values(nextState.portalVisibility).some(Boolean)
    );
  }

  componentDidMount() {
    const manager = this.manager;
    const queue = this.queue;

    while (queue.length && manager) {
      const action = queue.pop();
      if (action) {
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
        this.setState(
          updateVisibilityForKey(action.key, action.isFocused ?? false)
        );
      }
    }
  }

  private setManager = (manager: PortalManager | undefined | null) => {
    this.manager = manager;
  };

  private mount = (children: React.ReactNode, isFocused: boolean) => {
    const key = this.nextKey++;

    if (this.manager) {
      this.manager.mount(key, children);
      this.setState(updateVisibilityForKey(key, isFocused));
    } else {
      this.queue.push({ type: 'mount', key, children, isFocused });
    }

    return key;
  };

  private update = (
    key: number,
    children: React.ReactNode,
    isFocused: boolean
  ) => {
    if (this.manager) {
      this.manager.update(key, children);
      this.setState(updateVisibilityForKey(key, isFocused));
    } else {
      const op: Operation = { type: 'mount', key, children, isFocused };
      const index = this.queue.findIndex(
        (o) => o.type === 'mount' || (o.type === 'update' && o.key === key)
      );

      if (index > -1) {
        this.queue[index] = op;
      } else {
        this.queue.push(op as Operation);
      }
    }
  };

  private unmount = (key: number) => {
    if (this.manager) {
      this.manager.unmount(key);
      this.setState(updateVisibilityForKey(key, false));
    } else {
      this.queue.push({ type: 'unmount', key });
    }
  };

  private nextKey = 0;
  private queue: Operation[] = [];
  private manager: PortalManager | null | undefined;

  render() {
    const isPortalInFocus = Object.values(this.state.portalVisibility).some(
      Boolean
    );
    return (
      <PortalContext.Provider
        value={{
          mount: this.mount,
          update: this.update,
          unmount: this.unmount,
        }}
      >
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <View
          accessibilityElementsHidden={isPortalInFocus}
          importantForAccessibility={
            isPortalInFocus ? 'no-hide-descendants' : 'auto'
          }
          style={styles.container}
          collapsable={false}
          pointerEvents="box-none"
        >
          {this.props.children}
        </View>
        <PortalManager ref={this.setManager} />
      </PortalContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
