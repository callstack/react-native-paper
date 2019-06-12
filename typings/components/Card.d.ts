import * as React from 'react';

import { ImageProps, StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

import { ThemeShape } from '../types';

export interface CardContentProps extends ViewProps {
}

export interface CardActionsProps extends ViewProps {
  children: React.ReactNode;
}

export interface CardCoverProps extends ImageProps {
  theme?: ThemeShape;
}

export interface CardTitleProps extends ViewProps {
  title: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: React.ReactNode;
  subtitleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  left?: (props: { size:number }) => React.ReactNode;
  leftStyle?: StyleProp<ViewStyle>;
  right?: (props: { size:number }) => React.ReactNode;
  rightStyle?: StyleProp<ViewStyle>;

}

export interface CardProps {
  elevation?: number;
  onPress?: () => any;
  onLongPress?: () => any;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
  testID?: string;
  accessible?: boolean;
}

export declare class Card extends React.Component<CardProps> {
  static Content: React.ComponentType<CardContentProps>;
  static Actions: React.ComponentType<CardActionsProps>;
  static Cover: React.ComponentType<CardCoverProps>;
  static Title: React.ComponentType<CardTitleProps>;
}
