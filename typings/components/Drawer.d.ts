import * as React from 'react';
import { IconSource } from './Icon';
import { ThemeShape } from '..';

export interface ItemProps {
  label: string;
  icon?: IconSource;
  active?: boolean;
  onPress?: () => mixed;
  style?: any;
  theme?: ThemeShape;
}

export class Drawer extends React.Component<ItemProps> {}

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
  theme?: ThemeShape;
}

export class Section extends React.Component<SectionProps> {}
