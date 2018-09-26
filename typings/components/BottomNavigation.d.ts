import * as React from 'react';
import { IconSource } from './Icon';

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
  router: Array<T>;
};

export interface BottomNavigationProps<T> {
  shifting?: boolean;
  labeled?: boolean;
  navigationState: NavigationState<T>;
  onIndexChange: (index: number) => any;
  renderScene: (
    props: { route: T; jumpTo: (key: string) => any }
  ) => React.ReactNode | null | undefined;
}

export interface SceneProps<T> {
  route: T;
  jumpTo: (key: string) => any;
}

export class BottomNavigation<T> extends React.Component<
  BottomNavigationProps<T>
> {
  static SceneMap: (
    scenes: {
      [key: string]: React.ComponentType<{
        route: T;
        jumpTo: (key: string) => any;
      }>;
    }
  ) => React.ComponentType<{ route: T; jumpTo: (key: string) => any }>;
}
