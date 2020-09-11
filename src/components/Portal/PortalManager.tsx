import * as React from 'react';
import { View, StyleSheet } from 'react-native';

export type PortalManagerMethods = {
  mount: (key: number, children: React.ReactNode) => void;
  update: (key: number, children: React.ReactNode) => void;
  unmount: (key: number) => void;
};

/**
 * Portal host is the component which actually renders all Portals.
 */
const PortalManager: React.RefForwardingComponent<PortalManagerMethods, {}> = (
  _,
  ref
): any => {
  const [portals, setPortals] = React.useState<
    Array<{
      key: number;
      children: React.ReactNode;
    }>
  >([]);
  React.useImperativeHandle(
    ref,
    (): PortalManagerMethods => ({
      mount: (key: number, children: React.ReactNode) =>
        setPortals((portals) => [...portals, { key, children }]),
      update: (key: number, children: React.ReactNode) =>
        setPortals((portals) =>
          portals.map((item) => {
            if (item.key === key) {
              return { ...item, children };
            }
            return item;
          })
        ),
      unmount: (key: number) =>
        setPortals((portals) => portals.filter((item) => item.key !== key)),
    })
  );

  return portals.map(({ key, children }) => (
    <View
      key={key}
      collapsable={
        false /* Need collapsable=false here to clip the elevations, otherwise they appear above sibling components */
      }
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
    >
      {children}
    </View>
  ));
};

export default React.forwardRef(PortalManager);
