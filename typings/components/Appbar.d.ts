import * as React from 'react';
import { IconSource, ThemeShape } from '../types';

export interface AppbarContentProps {
  color?: string;
  title: React.ReactNode;
  titleStyle?: any;
  subtitle?: React.ReactNode;
  subtitleStyle?: any;
  style?: any;
  theme?: ThemeShape;
}

export interface AppbarActionProps {
  color?: string;
  icon: IconSource;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  style?: any;
}

export interface AppbarBackActionProps {
  color?: string;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  style?: any;
}

export interface AppbarHeaderProps {
  dark?: boolean;
  statusBarHeight?: number;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export interface AppbarProps {
  dark?: boolean;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class Appbar extends React.Component<AppbarProps> {
  static Content: React.ComponentClass<AppbarContentProps>;
  static Action: React.ComponentClass<AppbarActionProps>;
  static BackAction: React.ComponentClass<AppbarBackActionProps>;
  static Header: React.ComponentClass<AppbarHeaderProps>;
}
