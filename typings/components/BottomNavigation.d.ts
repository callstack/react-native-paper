import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IconSource, ThemeShape } from '../types';

type Route = Partial<{
  key: string;
  title: string;
  icon: IconSource;
  color: string;
  accessibilityLabel: string;
  testID: string;
}>;

type NavigationState<T extends Route> = {
  index: number;
  routes: Array<T>;
};

export interface SceneProps<T> {
  route: T;
  jumpTo: (key: string) => any;
}

export interface BottomNavigationProps<T> {
  shifting?: boolean;
  labeled?: boolean;
  navigationState: NavigationState<T>;
  onIndexChange: (index: number) => any;
  renderScene: (props: SceneProps<T>) => React.ReactNode | null | undefined;
  renderIcon?: (
    props: { route: T; focused: boolean; color: string }
  ) => React.ReactNode;
  renderLabel?: (
    props: { route: T; focused: boolean; color: string }
  ) => React.ReactNode;
  getLabelText?: (props: { route: T }) => string;
  getAccessibilityLabel?: (props: { route: T }) => string | null | undefined;
  getTestID?: (props: { route: T }) => string | null | undefined;
  getColor?: (props: { route: T }) => string;
  onTabPress?: (props: { route: T }) => any;
  activeColor?: string;
  inactiveColor?: string;
  barStyle?: any;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeShape;
}

export declare class BottomNavigation<T> extends React.Component<
  BottomNavigationProps<T>
> {
  static SceneMap: <P>(
    scenes: Record<string, React.ComponentType<SceneProps<P>>>
  ) => (props: SceneProps<P>) => React.ReactNode;
}
