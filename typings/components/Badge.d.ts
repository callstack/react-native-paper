import * as React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { ThemeShape } from '../types';

export interface BadgeProps {
  visible?: boolean;
  size?: number;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  theme?: ThemeShape;
}

export declare class Badge extends React.Component<BadgeProps> {}
