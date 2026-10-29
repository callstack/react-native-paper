import type * as React from 'react';
import type {
  PressableProps as PressableNativeProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Pressable as PressableNative } from 'react-native';

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
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode)
    | undefined;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    | undefined;
  /**
   * Called when a key goes down while the pressable has focus. Web only.
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  /**
   * Called when a key comes up while the pressable has focus. Web only.
   */
  onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void;
};

// @ts-expect-error React Native Web adds focused and hovered callback state fields that React Native omits.
export const Pressable: React.ForwardRefExoticComponent<
  PressableProps & React.RefAttributes<View>
> = PressableNative;
