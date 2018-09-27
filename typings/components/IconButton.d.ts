import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface IconButtonProps {
  icon: IconSource;
  color?: string;
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  onPress?: () => any;
  style?: any;
  theme?: ThemeShape;
}

export declare class IconButton extends React.Component<IconButtonProps> {}
