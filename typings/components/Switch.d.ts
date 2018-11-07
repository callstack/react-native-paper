import * as React from 'react';
import { ThemeShape } from '../types';

export interface SwitchProps {
  disabled?: boolean;
  value?: boolean;
  color?: string;
  onValueChange?: Function;
  style?: any;
  theme?: ThemeShape;
}

export declare class Switch extends React.Component<SwitchProps> {}
