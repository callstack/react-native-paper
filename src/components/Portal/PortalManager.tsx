import * as React from 'react';
import { StyleSheet } from 'react-native';

import PortalDismiss from './PortalDismiss';
import PortalLayer from './PortalLayer';

export type PortalOptions = {
  modal: boolean | undefined;
  onDismiss: (() => void) | undefined;
  dismissable: boolean;
};

type Props = {
  children: React.ReactNode;
};

type State = {
  portals: Array<
    PortalOptions & {
      key: number;
      children: React.ReactNode;
    }
  >;
};

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.Component<Props, State> {
  state: State = {
    portals: [],
  };

  mount = (key: number, children: React.ReactNode, options: PortalOptions) => {
    this.setState((state) => ({
      portals: [...state.portals, { key, children, ...options }],
    }));
  };

  update = (key: number, children: React.ReactNode, options: PortalOptions) =>
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.key === key) {
          return { ...item, children, ...options };
        }

        return item;
      }),
    }));

  unmount = (key: number) =>
    this.setState((state) => ({
      portals: state.portals.filter((item) => item.key !== key),
    }));

  render() {
    const { portals } = this.state;

    const topmostModalIndex = portals.findLastIndex((portal) => portal.modal);

    return (
      <>
        <PortalLayer
          inert={topmostModalIndex >= 0}
          style={styles.container}
          collapsable={
            false /* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */
          }
          pointerEvents="box-none"
        >
          {this.props.children}
        </PortalLayer>
        {portals.map(
          ({ key, children, modal, onDismiss, dismissable }, index) => (
            <PortalLayer
              key={key}
              inert={index < topmostModalIndex}
              onAccessibilityEscape={
                index === topmostModalIndex && dismissable
                  ? onDismiss
                  : undefined
              }
              collapsable={
                false /* Need collapsable=false here to clip the elevations, otherwise they appear above sibling components */
              }
              pointerEvents="box-none"
              style={StyleSheet.absoluteFill}
            >
              {modal ? (
                <PortalDismiss
                  enabled={index === topmostModalIndex}
                  dismissable={dismissable}
                  onDismiss={onDismiss}
                />
              ) : null}
              {children}
            </PortalLayer>
          )
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
