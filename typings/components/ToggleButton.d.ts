import * as React from 'react';
import { IconButtonProps } from './IconButton';
import { ThemeShape, IconSource } from '../types';

export interface ToggleButtonGroupProps {
  onValueChange: (value: string) => any;
  value: string;
  children: React.ReactNode;
}

export interface ToggleButtonProps extends IconButtonProps {
  disabled?: boolean;
  value?: string;
  status?: 'checked' | 'unchecked';
  theme?: ThemeShape;
}

export declare class ToggleButton extends React.Component<ToggleButtonProps> {
  static Group: React.ComponentClass<ToggleButtonGroupProps>;
}
