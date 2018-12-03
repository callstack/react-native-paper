import * as React from 'react';
import { ViewProps } from 'react-native';
import { ThemeShape } from '../types';

export interface DividerProps extends ViewProps {
  inset?: boolean;
  theme?: ThemeShape;
}

export declare class Divider extends React.Component<DividerProps> {}
