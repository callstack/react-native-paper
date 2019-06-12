import * as React from 'react';
import { ViewProps } from 'react-native';
import { ThemeShape } from '../types';

export interface ActivityIndicatorProps extends ViewProps {
  animating?: boolean;
  color?: string;
  size?: 'small' | 'large' | number;
  hidesWhenStopped?: boolean;
  theme?: ThemeShape;
}

export declare class ActivityIndicator extends React.Component<ActivityIndicatorProps> {
}
