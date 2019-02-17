import * as React from 'react';
import { ThemeShape } from '../types';

export interface ProgressBarProps {
  progress: number;
  animating?: boolean;
  indeterminate?: boolean;
  color?: string;
  style?: any;
  theme?: ThemeShape;
}

export declare class ProgressBar extends React.Component<ProgressBarProps> {}
