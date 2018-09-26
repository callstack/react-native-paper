import * as React from 'react';
import { ThemeShape } from '..';

export interface TextInputProps {
  mode?: 'flat' | 'outlined';
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  error?: boolean;
  onChangeText?: Function;
  underlineColor?: string;
  multiline?: boolean;
  numberOfLines?: number;
  onFocus?: () => mixed;
  onBlur?: () => mixed;
  value?: string;
  style?: any;
  theme?: ThemeShape;
}

export class TextInput extends React.Component<TextInputProps> {}
