import * as React from 'react';
import { StyleProp, TextInputProps, TextStyle } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface SearchbarProps extends TextInputProps {
  inputStyle?: StyleProp<TextStyle>;
  icon?: IconSource;
  theme?: ThemeShape;
  clearIcon?: IconSource;
  onIconPress?: () => any;
  onChangeText?: (query: string) => void;
}

export declare class Searchbar extends React.Component<SearchbarProps> {
  isFocused: () => boolean;
  clear: () => void;
  focus: () => void;
  blur: () => void;
}
