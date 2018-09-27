import * as React from 'react';
import { ThemeShape } from '../types';

export interface SnackbarProps {
  visible: boolean;
  action?: {
    label: string;
    onPress: () => any;
  };
  duration?: number;
  onDismiss: () => any;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class Snackbar extends React.Component<SnackbarProps> {
  static DURATION_SHORT: string;
  static DURATION_MEDIUM: string;
  static DURATION_LONG: string;
}
