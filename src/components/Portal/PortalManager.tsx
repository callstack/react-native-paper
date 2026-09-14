import * as React from 'react';
import { StyleSheet } from 'react-native';

import OverlayLayer from './OverlayLayer';

type Props = {
  pageContent?: React.ReactNode;
};

type State = {
  portals: Array<{
    key: number;
    children: React.ReactNode;
    overlay?: boolean;
  }>;
};

/**
 * Portal host is the component which actually renders all Portals.
 */
export default class PortalManager extends React.PureComponent<Props, State> {
  state: State = {
    portals: [],
  };

  mount = (key: number, children: React.ReactNode, overlay?: boolean) => {
    this.setState((state) => ({
      portals: [...state.portals, { key, children, overlay }],
    }));
  };

  update = (key: number, children: React.ReactNode, overlay?: boolean) =>
    this.setState((state) => ({
      portals: state.portals.map((item) => {
        if (item.key === key) {
          return { ...item, children, overlay };
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

    const topmostOverlayIndex = portals.findLastIndex(
      (portal) => portal.overlay
    );

    return (
      <>
        {/* Need collapsable=false here to clip the elevations, otherwise they appear above Portal components */}
        <OverlayLayer
          inert={topmostOverlayIndex >= 0}
          style={styles.container}
          collapsable={false}
          pointerEvents="box-none"
        >
          {this.props.pageContent}
        </OverlayLayer>
        {portals.map(({ key, children }, index) => (
          <OverlayLayer
            key={key}
            inert={index < topmostOverlayIndex}
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
