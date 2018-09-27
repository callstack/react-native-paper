import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  dark?: boolean;
  compact?: boolean;
  color?: string;
  loading?: boolean;
  icon?: IconSource;
  disabled?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
  onPress?: () => any;
  style?: any;
  theme?: ThemeShape;
}

export declare class Button extends React.Component<ButtonProps> {}
