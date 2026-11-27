import * as React from 'react';
import type {
  PressableProps as PressableNativeProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Platform, Pressable as PressableNative } from 'react-native';

import { PortalInertContext } from '../Portal/PortalInertContext';

// This component is added to support type-safe hover and focus states on web
// https://necolas.github.io/react-native-web/docs/pressable/

export type PressableStateCallbackType = {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
};

export type PressableProps = Omit<
  PressableNativeProps,
  'children' | 'style'
> & {
  children?:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode)
    | undefined;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    | undefined;
};

// On Android `accessible` is what makes a view keyboard focusable, and
// `focusable` is what lets Enter press it, so both have to go. The layer
// behind a modal is already hidden from TalkBack, so nothing else changes.
const androidInertProps = {
  accessible: false,
  focusable: false,
} as const;

function PaperPressable({
  ref,
  ...rest
}: PressableNativeProps & {
  ref?: React.Ref<React.ComponentRef<typeof View>>;
}) {
  const inert = React.useContext(PortalInertContext);

  return (
    <PressableNative
      {...rest}
      {...(Platform.OS === 'android' && inert && androidInertProps)}
      ref={ref}
    />
  );
}

// @ts-expect-error React Native Web adds focused and hovered callback state fields that React Native omits.
export const Pressable: React.ForwardRefExoticComponent<
  PressableProps & React.RefAttributes<React.ComponentRef<typeof View>>
> = PaperPressable;
