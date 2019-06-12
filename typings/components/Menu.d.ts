import * as React from 'react';
import { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface MenuProps {
  visible: boolean;
  anchor: React.ReactNode;
  onDismiss: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeShape;
}

export interface ItemProps {
  title: React.ReactNode;
  icon?: IconSource;
  disabled?: boolean;
  onPress?: () => void;
  theme?: ThemeShape;
  style?: StyleProp<ViewStyle>;
}

export class Menu extends React.Component<MenuProps> {
  static Item: React.ComponentType<ItemProps>;
}
