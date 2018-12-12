import * as React from 'react';
import { ViewProps } from 'react-native';
import { IconSource, ThemeShape } from '../types';

export interface ItemProps extends ViewProps {
  label: string;
  icon?: IconSource;
  active?: boolean;
  numberOfLines?: number | null;
  theme?: ThemeShape;
  onPress?: () => void;
}

export declare class Item extends React.Component<ItemProps> {}

export interface SectionProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
  numberOfLines?: number | null;
  theme?: ThemeShape;
}

export declare class Section extends React.Component<SectionProps> {}
