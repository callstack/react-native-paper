import * as React from 'react';
import { ThemingType } from '@callstack/react-theme-provider';
import { ImageSourcePropType } from 'react-native';

type IconSourceBase = string | ImageSourcePropType;

interface PartialIconProps {
  color: string;
  size: number;
}

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: PartialIconProps) => React.ReactNode);

type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type Theme = {
  dark: boolean;
  roundness: number;
  colors: {
    primary: string;
    background: string;
    surface: string;
    accent: string;
    error: string;
    text: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
  };
  fonts: {
    regular: string;
    medium: string;
    light: string;
    thin: string;
  };
};

export type ThemeShape = DeepPartial<Theme>;
export declare const withTheme: Pick<
  ThemingType<Theme, ThemeShape>,
  'withTheme'
>;
export declare const DefaultTheme: Theme;
export declare const DarkTheme: Theme;
export declare const ThemeProvider: Pick<
  ThemingType<Theme, ThemeShape>,
  'ThemeProvider'
>;

export declare class Provider extends React.Component<{
  children: React.ReactNode;
  theme?: ThemeShape;
}> {}
