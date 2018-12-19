import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface ChipProps {
  mode?: 'flat' | 'outlined';
  children: React.ReactNode;
  icon?: IconSource;
  avatar?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  onClose?: () => any;
  style?: any;
  theme?: ThemeShape;
  testID?: string;
}

export declare class Chip extends React.Component<ChipProps> {}
