import * as React from 'react';
import { ImageSourcePropType } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface IconProps {
  icon: IconSource;
  size?: number;
  color?: string;
  style?: any;
  theme?: ThemeShape;
}

export declare class Icon extends React.Component<IconProps> {}

export interface ImageProps {
  source: ImageSourcePropType;
  size?: number;
  style?: any;
  theme?: ThemeShape;
}

export declare class Image extends React.Component<ImageProps> {}

export interface TextProps {
  label: string;
  size?: number;
  color?: string;
  style?: any;
  theme?: ThemeShape;
}

export declare class Text extends React.Component<TextProps> {}

export declare class Avatar {
  static Icon: Icon;
  static Image: Image;
  static Text: Text;
}
