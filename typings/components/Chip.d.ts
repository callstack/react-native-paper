import * as React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface ChipProps {
  mode?: 'flat' | 'outlined';
  children: React.ReactNode;
  icon?: IconSource;
  avatar?: React.ReactNode;
  selected?: boolean;
  selectedColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  onClose?: () => any;
  textStyle?: StyleProp<TextStyle>;
  style?: any;
  theme?: ThemeShape;
  testID?: string;
}

export declare class Chip extends React.Component<ChipProps> {}
