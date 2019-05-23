import * as React from 'react';
import {
  StyleProp,
  ViewStyle,
  ViewProps,
  TextProps,
  TextStyle,
} from 'react-native';
import { ThemeShape, IconSource, EllipsizeProp } from '../types';
import { TouchableRipplePropsWithoutChildren } from './TouchableRipple';

export interface AccordionProps {
  children: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  expanded?: boolean;
  onPress?: () => any;
  left?: (props: { color: string }) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  theme?: ThemeShape;
}

export declare class Accordion extends React.Component<AccordionProps> {}

export interface IconProps {
  icon: IconSource;
  color: string;
  style?: StyleProp<ViewStyle>;
}

export declare class Icon extends React.Component<IconProps> {}

export interface ItemProps extends TouchableRipplePropsWithoutChildren {
  title: React.ReactNode;
  description?: React.ReactNode;
  left?: (props: { color: string }) => React.ReactNode;
  right?: (props: { color: string }) => React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  titleEllipsizeMode?: EllipsizeProp;
  descriptionEllipsizeMode?: EllipsizeProp;
}

export declare class Item extends React.Component<ItemProps> {}

export interface SectionProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
  theme?: ThemeShape;
  titleStyle?: StyleProp<TextStyle>,
}

export declare class Section extends React.Component<SectionProps> {}

export interface SubheaderProps extends TextProps {
  style?: StyleProp<TextStyle>;
  theme?: ThemeShape;
}

export declare class Subheader extends React.Component<SubheaderProps> {}
