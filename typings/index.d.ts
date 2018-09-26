import * as React from 'react';
import { ThemingType } from '@callstack/react-theme-provider';
import Colors from './Colors';
import * as List from './components/List';
import * as Drawer from './components/Drawer';

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
export const withTheme: Pick<ThemingType<Theme, ThemeShape>, 'withTheme'>;
export const DefaultTheme: Theme;
export const DarkTheme: Theme;
export const ThemeProvider: Pick<
  ThemingType<Theme, ThemeShape>,
  'ThemeProvider'
>;

export class Provider extends React.Component<{
  children: React.ReactNode;
  theme?: ThemeShape;
}> {}

export { Colors, List, Drawer };
