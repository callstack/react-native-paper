import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface FABGroupAction {
  icon: string;
  label?: string;
  color?: string;
  accessibilityLabel?: string;
  style?: any;
  onPress: () => any;
}

export interface FABGroupProps {
  actions: Array<FABGroupAction>;
  icon: IconSource;
  accessibilityLabel?: string;
  color?: string;
  onPress?: () => any;
  open: boolean;
  onStateChange: (state: { open: boolean }) => any;
  style?: any;
  theme?: ThemeShape;
}

export interface FABProps {
  icon: IconSource;
  label?: string;
  accessibilityLabel?: string;
  small?: boolean;
  color?: string;
  disabled?: boolean;
  onPress?: () => any;
  style?: any;
  theme?: ThemeShape;
}

export class FAB extends React.Component<FABProps> {
  static Group: React.ComponentType<FABGroupProps>;
}
