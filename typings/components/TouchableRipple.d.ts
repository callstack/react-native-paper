import * as React from 'react';
import { ThemeShape } from '../types';

export interface TouchableRippleProps {
  borderless?: boolean;
  background?: Object;
  disabled?: boolean;
  onPress?: Function;
  rippleColor?: string;
  underlayColor?: string;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class TouchableRipple extends React.Component<
  TouchableRippleProps
> {
  static supported: boolean;
}
