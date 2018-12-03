import * as React from 'react';
import { ImageProps, ViewProps } from 'react-native';
import { ThemeShape } from '../types';

export interface CardContentProps extends ViewProps {
}

export interface CardActionsProps extends ViewProps {
  children: React.ReactNode;
}

export interface CardCoverProps extends ImageProps {
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
