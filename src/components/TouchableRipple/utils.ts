import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import * as React from 'react';

export type InteractionState = {
  hovered?: boolean;
  focused?: boolean;
  pressed: boolean;
};

export type InteractionStyleType =
  | StyleProp<ViewStyle>
  | ((interactionState: InteractionState) => StyleProp<ViewStyle>);

export type InteractionChildrenType =
  | React.ReactNode
  | ((interactionState: InteractionState) => React.ReactNode);

export function getInteractionStyle(
  interactionState: InteractionState,
  s: InteractionStyleType
) {
  return typeof s === 'function' ? s(interactionState) : s;
}

export function getInteractionChildren(
  interactionState: InteractionState,
  c: InteractionChildrenType
) {
  return typeof c === 'function' ? c(interactionState) : c;
}

export function useRadiusStyles(style: InteractionStyleType): ViewStyle {
  return React.useMemo(() => {
    const flattenStyles = StyleSheet.flatten(
      getInteractionStyle({ pressed: false }, style)
    );
    return pickRadiusStyles(flattenStyles);
  }, [style]);
}

export function pickRadiusStyles({
  borderBottomEndRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderBottomStartRadius,
  borderRadius,
  borderTopEndRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderTopStartRadius,
}: ViewStyle = {}) {
  return {
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderRadius,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
  };
}
