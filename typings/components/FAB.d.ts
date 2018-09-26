import * as React from 'react';
import { IconSource } from './Icon';
import { ThemeShape } from '..';

export interface FABGroupProps {
  actions: Array<{
    icon: string;
    label?: string;
    color?: string;
    accessibilityLabel?: string;
    style?: any;
    onPress: () => any;
  }>;
  icon: IconSource;
  accessibilityLabel?: string;
  color?: string;
  onPress?: () => any;
  open: boolean;
  onStateChange: (state: { open: boolean }) => any;
  style?: any;
  theme?: ThemeShape;
}

class FABGroup extends React.Component<FABGroupProps> {}

export interface FABProps {
  icon: IconSource;
  label?: string;
  accessibilityLabel?: string;
  small?: boolean;
  color?: string;
  disabled?: boolean;
  onPress?: () => mixed;
  style?: any;
  theme?: ThemeShape;
}

export class FAB extends React.Component<FABProps> {
  static Group: FABGroup;
}
