import type * as React from 'react';
import type {
  Animated,
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
    | Animated.WithAnimatedValue<StyleProp<ViewStyle>>
    | ((
        state: PressableStateCallbackType
      ) =>
        | StyleProp<ViewStyle>
        | Animated.WithAnimatedValue<StyleProp<ViewStyle>>)
    | undefined;
};

export const Pressable: React.ForwardRefExoticComponent<
  PressableProps & React.RefAttributes<View>
> = PressableNative as any;
