import * as React from 'react';
import { SwitchProps as NativeSwitchProps } from 'react-native';
import { ThemeShape } from '../types';

export interface SwitchProps extends NativeSwitchProps {
  color?: string;
  theme?: ThemeShape;
}

export declare class Switch extends React.Component<SwitchProps> {}
