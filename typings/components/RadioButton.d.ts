import * as React from 'react';
import { ThemeShape } from '..';

export interface RadioButtonGroupProps {
  onValueChange: (value: string) => mixed;
  value: string;
  children: React.ReactNode;
}

class RadioButtonGroup extends React.Component<RadioButtonGroupProps> {}

export interface RadioButtonProps {
  value: string;
  status?: 'checked' | 'unchecked';
  disabled?: boolean;
  onPress?: () => any;
  uncheckedColor?: string;
  color?: string;
  theme?: ThemeShape;
}

export class RadioButton extends React.Component<RadioButtonProps> {
  static Group: RadioButtonGroup;
  static Android: React.Component<RadioButtonProps>;
  static IOS: React.Component<RadioButtonProps>;
}
