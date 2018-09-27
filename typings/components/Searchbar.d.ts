import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface SearchbarProps {
  placeholder?: string;
  value: string;
  icon?: IconSource;
  onChangeText?: (query: string) => void;
  onIconPress?: () => any;
  style?: any;
  theme?: ThemeShape;
}

export declare class Searchbar extends React.Component<SearchbarProps> {}
