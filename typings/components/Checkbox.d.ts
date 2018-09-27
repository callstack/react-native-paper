import * as React from 'react';
import { ThemeShape } from '../types';

export interface CheckboxProps {
  status: 'checked' | 'unchecked' | 'indeterminate';
  disabled?: boolean;
  onPress?: () => any;
  uncheckedColor?: string;
  color?: string;
  theme?: ThemeShape;
}

export declare class Checkbox extends React.Component<CheckboxProps> {
  static Android: React.ComponentType<CheckboxProps>;
  static IOS: React.ComponentType<CheckboxProps>;
}
