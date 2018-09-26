import * as React from 'react';
import { IconSource } from './Icon';
import { ThemeShape } from '..';

export interface SearchbarProps {
  placeholder?: string;
  value: string;
  icon?: IconSource;
  onChangeText?: (query: string) => void;
  onIconPress?: () => any;
  style?: any;
  theme?: ThemeShape;
}

export class Searchbar extends React.Component<SearchbarProps> {}
