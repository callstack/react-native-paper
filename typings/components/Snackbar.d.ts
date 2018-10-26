import * as React from 'react';
import { StyleProp, ViewStyle, TextInputProps } from 'react-native';
import { ThemeShape } from '../types';

export interface SnackbarProps extends TextInputProps {
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
  static DURATION_SHORT: string;
  static DURATION_MEDIUM: string;
  static DURATION_LONG: string;
}
