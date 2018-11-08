import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ThemeShape, IconSource } from '../types';
import { TouchableRippleProps } from './TouchableRipple';

export interface ButtonProps extends TouchableRippleProps {
  mode?: 'text' | 'outlined' | 'contained';
  color?: string;
  dark?: boolean;
  compact?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: IconSource;
  theme?: ThemeShape;
}

export declare class Button extends React.Component<ButtonProps> {}
