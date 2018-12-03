import * as React from 'react';
import { TextInputProps } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface SearchbarProps extends TextInputProps {
  icon?: IconSource;
  theme?: ThemeShape;
  onIconPress?: () => any;
  onChangeText?: (query: string) => void;
}

export declare class Searchbar extends React.Component<SearchbarProps> {}
