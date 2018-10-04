import * as React from 'react';
import { ThemeShape } from '../types';

export interface RadioButtonGroupProps {
  onValueChange: (value: string) => any;
  value: string;
  children: React.ReactNode;
}

export interface RadioButtonProps {
  value: string;
  status?: 'checked' | 'unchecked';
  disabled?: boolean;
  onPress?: () => any;
  uncheckedColor?: string;
  color?: string;
  theme?: ThemeShape;
}

export declare class RadioButton extends React.Component<RadioButtonProps> {
  static Group: React.ComponentType<RadioButtonGroupProps>;
  static Android: React.ComponentType<RadioButtonProps>;
  static IOS: React.ComponentType<
    Exclude<RadioButtonProps, { uncheckedColor?: string }>
  >;
}
