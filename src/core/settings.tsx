import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type Settings = {
  icon?: ({
    name,
    color,
    size,
    style,
    pointerEvents,
    accessibilityProps,
  }: {
    name: string;
    color: string;
    size: number;
    style: StyleProp<ViewStyle>;
    pointerEvents: 'none';
    accessibilityProps: any;
  }) => React.ReactNode;
};

export const { Provider, Consumer } = React.createContext<Settings>({});
