import * as React from 'react';
import { ThemeShape } from '../types';

export interface DividerProps {
  inset?: boolean;
  style?: any;
  theme?: ThemeShape;
}

export declare class Divider extends React.Component<DividerProps> {}
