import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ThemeShape, IconSource } from '../types';

export interface TooltipProps {
  title: string;
  children: React.ReactNode;
  delayLongPress?: number;
  style?: StyleProp<ViewStyle>;
}

export declare class Tooltip extends React.Component<TooltipProps> {}
