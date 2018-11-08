import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ThemeShape } from '../types';

export interface SnackbarProps {
  children: React.ReactNode;
  visible: boolean;
  action?: {
    label: string;
    onPress: () => any;
  };
  duration?: number;
  onDismiss: () => any;
  style?: StyleProp<ViewStyle>;
  theme?: ThemeShape;
}

export declare class Snackbar extends React.Component<SnackbarProps> {
  static DURATION_SHORT: number;
  static DURATION_MEDIUM: number;
  static DURATION_LONG: number;
}
