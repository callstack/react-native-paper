import * as React from 'react';
import { TouchableHighlightProps, TouchableNativeFeedbackProps } from 'react-native';
import { ThemeShape } from '../types';

interface TouchableRipplePropsWithoutChildren extends TouchableHighlightProps, TouchableNativeFeedbackProps {
  borderless?: boolean;
  rippleColor?: string;
  underlayColor?: string;
  theme?: ThemeShape;
}

export interface TouchableRippleProps extends TouchableRipplePropsWithoutChildren {
  children: React.ReactNode;
}

export declare class TouchableRipple extends React.Component<TouchableRippleProps> {
  static supported: boolean;
}
