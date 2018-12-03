import * as React from 'react';
import { ThemeShape } from '../types';
import { TouchableRipplePropsWithoutChildren } from './TouchableRipple';

export interface RadioButtonGroupProps {
  onValueChange: (value: string) => any;
  value: string;
  children: React.ReactNode;
}

export interface RadioButtonProps extends TouchableRipplePropsWithoutChildren {
  value: string;
  status?: 'checked' | 'unchecked';
  uncheckedColor?: string;
  color?: string;
}

export declare class RadioButton extends React.Component<RadioButtonProps> {
  static Group: React.ComponentType<RadioButtonGroupProps>;
  static Android: React.ComponentType<RadioButtonProps>;
  static IOS: React.ComponentType<
    Exclude<RadioButtonProps, { uncheckedColor?: string }>
  >;
}
