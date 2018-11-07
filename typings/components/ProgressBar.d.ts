import * as React from 'react';
import { ThemeShape } from '../types';

export interface ProgressBarProps {
  progress: number;
  color?: string;
  style?: any;
  theme?: ThemeShape;
}

export declare class ProgressBar extends React.Component<ProgressBarProps> {}
