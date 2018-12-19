import * as React from 'react';
import { ThemeShape } from '../types';

export interface BadgeProps {
  size?: number;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export interface BadgeWrapperProps {
  value?: string|number;
  verticalPosition?: 'top' | 'bottom';
  horizontalPosition?: 'left' | 'right';
  size?: number;
  children: React.ReactNode;
  style?: any;
}

export declare class Badge extends React.Component<BadgeProps> {
  static Wrapper: React.ComponentType<BadgeWrapperProps>;
}
