import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface ItemProps {
  label: string;
  icon?: IconSource;
  active?: boolean;
  onPress?: () => any;
  style?: any;
  theme?: ThemeShape;
}

export declare class Item extends React.Component<ItemProps> {}

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
  theme?: ThemeShape;
}

export declare class Section extends React.Component<SectionProps> {}
