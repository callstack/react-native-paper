import * as React from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import { ThemeShape } from '../types';

export interface TouchableRippleProps extends TouchableWithoutFeedbackProps {
  borderless?: boolean;
  background?: Object;
  disabled?: boolean;
  rippleColor?: string;
  underlayColor?: string;
  children: React.ReactNode;
  theme?: ThemeShape;
}

export declare class TouchableRipple extends React.Component<
  TouchableRippleProps
> {
  static supported: boolean;
}
