import * as React from 'react';
import { ThemeShape } from '../index';
import { IconSource } from './Icon';

export interface AccordionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  left?: (props: { color: string }) => React.ReactNode;
  children: React.ReactNode;
  theme?: ThemeShape;
  style?: any;
}

export class Accordion extends React.Component<AccordionProps> {}

export interface IconProps {
  icon: IconSource;
  color: string;
  style?: any;
}

export class Icon extends React.Component<IconProps> {}

export interface ItemProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  left?: (props: { color: string }) => React.ReactNode;
  right?: (props: { color: string }) => React.ReactNode;
  onPress?: () => any;
  theme?: ThemeShape;
  style?: any;
}

export class Item extends React.Component<ItemProps> {}

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
  theme?: ThemeShape;
  style?: any;
}

export class Section extends React.Component<SectionProps> {}
