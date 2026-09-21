import * as React from 'react';
import { StyleSheet } from 'react-native';

import OverlayLayer from './OverlayLayer';

type Props = {
  children: React.ReactNode;
};

type State = {
  portals: Array<{
    key: number;
    children: React.ReactNode;
    modal?: boolean;
  }>;
};

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<Props, State> {
  state: State = {
    portals: [],
  };

  mount = (key: number, children: React.ReactNode, modal?: boolean) => {
    this.setState((state) => ({
      portals: [...state.portals, { key, children, modal }],
    }));
  };

  update = (key: number, children: React.ReactNode, modal?: boolean) =>
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.key === key) {
          return { ...item, children, modal };
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
        <OverlayLayer
          inert={topmostModalIndex >= 0}
          style={styles.container}
          collapsable={
            false /* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */
          }
          pointerEvents="box-none"
        >
          {this.props.children}
        </OverlayLayer>
        {portals.map(({ key, children }, index) => (
          <OverlayLayer
            key={key}
            inert={index < topmostModalIndex}
            collapsable={
              false /* Need collapsable=false here to clip the elevations, otherwise they appear above sibling components */
            }
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
          >
            {children}
          </OverlayLayer>
        ))}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
