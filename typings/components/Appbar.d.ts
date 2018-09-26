import * as React from 'react';
import { ThemeShape } from '..';
import { IconSource } from './Icon';

export interface AppbarContentProps {
  color?: string;
  title: React.ReactNode;
  titleStyle?: any;
  subtitle?: React.ReactNode;
  subtitleStyle?: any;
  style?: any;
  theme?: ThemeShape;
}

class AppbarContent extends React.Component<AppbarContentProps> {}

export interface AppbarActionProps {
  color?: string;
  icon: IconSource;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  style?: any;
}

class AppbarAction extends React.Component<AppbarActionProps> {}

export interface AppbarBackActionProps {
  color?: string;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  style?: any;
}

class AppbarBackAction extends React.Component<AppbarBackActionProps> {}

export interface AppbarHeaderProps {
  dark?: boolean;
  statusBarHeight?: number;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

class AppbarHeader extends React.Component<AppbarHeaderProps> {}

export interface AppbarProps {
  dark?: boolean;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export class Appbar extends React.Component<AppbarProps> {
  static Content: AppbarContent;
  static Action: AppbarAction;
  static BackAction: AppbarBackAction;
  static Header: AppbarHeader;
}
