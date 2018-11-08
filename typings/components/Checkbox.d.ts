import * as React from 'react';
import { TouchableHighlightProps, TouchableNativeFeedbackProps } from 'react-native';
import { ThemeShape } from '../types';

export interface CheckboxProps extends TouchableHighlightProps, TouchableNativeFeedbackProps {
  status: 'checked' | 'unchecked' | 'indeterminate';
  uncheckedColor?: string;
  color?: string;
  theme?: ThemeShape;
}

export declare class Checkbox extends React.Component<CheckboxProps> {
  static Android: React.ComponentType<CheckboxProps>;
  static IOS: React.ComponentType<CheckboxProps>;
}
