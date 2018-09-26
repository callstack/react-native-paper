import * as React from 'react';
import { IconSource } from './Icon';
import { ThemeShape } from '..';

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

export class Button extends React.Component<ButtonProps> {}
