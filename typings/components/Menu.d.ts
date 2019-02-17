import * as React from 'react';
import { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface MenuProps {
  visible: boolean;
  button: React.ReactNode;
  onDismiss: () => mixed;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export interface ItemProps {
  title: React.ReactNode;
  icon?: IconSource;
  disabled?: boolean;
  onPress?: () => mixed;
  theme?: ThemeShape;
  style?: any;
}

export declare class Menu extends React.Component<MenuProps> {
    static Item: React.ComponentType<ItemProps>;
}
