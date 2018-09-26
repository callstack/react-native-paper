import * as React from 'react';
import { ThemeShape } from '..';

export interface CardContentProps {
  index?: number;
  total?: number;
  sibling?: Array<string>;
  style?: any;
}

class CardContent extends React.Component<CardContentProps> {}

export interface CardActionsProps {
  children: React.ReactNode;
  style?: any;
}

class CardAction extends React.Component<CardActionsProps> {}

export interface CardCoverProps {
  index?: number;
  total?: number;
  style?: any;
  theme: ThemeShape;
}

class CardCover extends React.Component<CardCoverProps> {}

export interface CardProps {
  elevation?: number;
  onPress?: () => any;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export class Card extends React.Component<CardProps> {
  static Content: CardContent;
  static Actions: CardAction;
  static Cover: CardCover;
}
