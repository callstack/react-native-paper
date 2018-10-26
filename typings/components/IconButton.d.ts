import * as React from 'react';
import { ThemeShape, IconSource } from '../types';
import { TouchableRippleProps } from './TouchableRipple';

export interface IconButtonProps extends TouchableRippleProps {
  icon: IconSource;
  color?: string;
  size?: number;
}

export declare class IconButton extends React.Component<IconButtonProps> {}
