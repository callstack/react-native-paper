import * as React from 'react';
import { ThemeShape } from '..';

export interface CheckboxProps {
  status: 'checked' | 'unchecked' | 'indeterminate';
  disabled?: boolean;
  onPress?: () => any;
  uncheckedColor?: string;
  color?: string;
  theme?: ThemeShape;
}

export class Checkbox extends React.Component<CheckboxProps> {
  static Android: React.Component<CheckboxProps>;
  static IOS: React.Component<CheckboxProps>;
}
