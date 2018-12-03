import * as React from 'react';
import { ThemeShape } from '../types';

export interface BadgeProps {
  value?: string|number;
  verticalPosition?: 'top' | 'bottom';
  horizontalPosition?: 'left' | 'right';
  size?: number;
  color?: string;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class Badge extends React.Component<BadgeProps> {}
