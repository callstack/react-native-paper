import * as React from 'react';
import { ImageProps } from 'react-native';
import { ThemeShape } from '../types';

export interface CardContentProps {
  style?: any;
}

export interface CardActionsProps {
  children: React.ReactNode;
  style?: any;
}

export interface CardCoverProps extends ImageProps {
  style?: any;
  theme?: ThemeShape;
}

export interface CardProps {
  elevation?: number;
  onPress?: () => any;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class Card extends React.Component<CardProps> {
  static Content: React.ComponentType<CardContentProps>;
  static Actions: React.ComponentType<CardActionsProps>;
  static Cover: React.ComponentType<CardCoverProps>;
}
