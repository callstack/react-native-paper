import * as React from 'react';
import { IconSource } from './Icon';
import { ThemeShape } from '..';

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

export class IconButton extends React.Component<IconButtonProps> {}
