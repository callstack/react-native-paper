import * as React from 'react';
import { TextInputProps as NativeTextInputProps } from 'react-native';
import { ThemeShape } from '../types';

export interface TextInputProps extends NativeTextInputProps {
  mode?: 'flat' | 'outlined';
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  error?: boolean;
  onChangeText?: (text: string) => void;
  underlineColor?: string;
  multiline?: boolean;
  numberOfLines?: number;
  onFocus?: () => any;
  onBlur?: () => any;
  render?: (props: RenderProps) => React.ReactNode;
  value?: string;
  style?: any;
  theme?: ThemeShape;
}

export interface RenderProps extends NativeTextInputProps {
  ref: (ref: any) => void;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor: string;
  editable?: boolean;
  selectionColor: string;
  onFocus: () => any;
  onBlur: () => any;
  underlineColorAndroid: string;
  style: any;
  multiline?: boolean;
  numberOfLines?: number;
  value?: string;
}

export declare class TextInput extends React.Component<TextInputProps> {}
