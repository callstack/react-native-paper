import * as React from 'react';
import { ThemeShape, IconSource } from '../types';

export interface IconProps {
    icon: IconSource,
    size: number,
    color?: string,
    backgroundColor?: string,
    style?: any,
    theme?: ThemeShape,

}

export declare class Icon extends React.Component<IconProps> {}

export interface ImageProps {
  source: {
    src: string,
  }
| number,
    size: number,
    color?: string,
    backgroundColor?: string,
    style?: any,
    them?: ThemeShape,

}

export declare class Image extends React.Component<ImageProps> {}

export interface TextProps {
    label?: string,
    size: number,
    color?: string,
    backgroundColor?: string,
    style?: any,
    theme?: ThemeShape,

}

export declare class Text extends React.Component<TextProps> {}