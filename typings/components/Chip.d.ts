import * as React from 'react';
import { IconSource } from './Icon';
import { ThemeShape } from '..';

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
  theme: ThemeShape;
}

export class Chip extends React.Component<ChipProps> {}
