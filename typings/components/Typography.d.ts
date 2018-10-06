import * as React from 'react';
import { TextProps } from 'react-native';
import { ThemeShape } from '../types';

interface TypographyProps extends TextProps {
  style?: any;
}

export declare class Caption extends React.Component<TypographyProps> {}
export declare class Headline extends React.Component<TypographyProps> {}
export declare class Paragraph extends React.Component<TypographyProps> {}
export declare class Subheading extends React.Component<TypographyProps> {}
export declare class Title extends React.Component<TypographyProps> {}
export declare class Text extends React.Component<
  TypographyProps & {
    theme?: ThemeShape;
  }
> {}
