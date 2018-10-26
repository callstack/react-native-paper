import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle, ViewProps, TouchableNativeFeedbackProps } from 'react-native';
import { IconSource, ThemeShape } from '../types';
import { TouchableRipplePropsWithoutChildren } from './TouchableRipple';

export interface AppbarContentProps {
  color?: string;
  title: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: React.ReactNode;
  subtitleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeShape;
}

export interface AppbarActionProps extends TouchableRipplePropsWithoutChildren {
  color?: string;
  icon: IconSource;
  size?: number;
}

export interface AppbarBackActionProps extends TouchableRipplePropsWithoutChildren {
  color?: string;
  size?: number;
}

export interface AppbarHeaderProps extends ViewProps {
  children: React.ReactNode;
  dark?: boolean;
  statusBarHeight?: number;
  theme?: ThemeShape;
}

export interface AppbarProps extends ViewProps {
  children: React.ReactNode;
  dark?: boolean;
  theme?: ThemeShape;
}

export declare class Appbar extends React.Component<AppbarProps> {
  static Content: React.ComponentClass<AppbarContentProps>;
  static Action: React.ComponentClass<AppbarActionProps>;
  static BackAction: React.ComponentClass<AppbarBackActionProps>;
  static Header: React.ComponentClass<AppbarHeaderProps>;
}
