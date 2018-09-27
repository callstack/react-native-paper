import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface AccordionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  left?: (props: { color: string }) => React.ReactNode;
  children: React.ReactNode;
  theme?: ThemeShape;
  style?: any;
}

export declare class Accordion extends React.Component<AccordionProps> {}

export interface IconProps {
  icon: IconSource;
  color: string;
  style?: any;
}

export declare class Icon extends React.Component<IconProps> {}

export interface ItemProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  left?: (props: { color: string }) => React.ReactNode;
  right?: (props: { color: string }) => React.ReactNode;
  onPress?: () => any;
  theme?: ThemeShape;
  style?: any;
}

export declare class Item extends React.Component<ItemProps> {}

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
  theme?: ThemeShape;
  style?: any;
}

export declare class Section extends React.Component<SectionProps> {}
