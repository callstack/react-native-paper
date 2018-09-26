import * as React from 'react';
import { ThemeShape } from '..';

export interface SnackbarProps {
  visible: boolean;
  action?: {
    label: string;
    onPress: () => mixed;
  };
  duration?: number;
  onDismiss?: () => any;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export class Snackbar extends React.Component<SnackbarProps> {
  static DURATION_SHORT: string;
  static DURATION_MEDIUM: string;
  static DURATION_LONG: string;
}
