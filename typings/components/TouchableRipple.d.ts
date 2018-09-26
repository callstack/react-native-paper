import * as React from 'react';
import { ThemeShape } from '..';

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

export class TouchableRipple extends React.Component<TouchableRippleProps> {}
