import * as React from 'react';
import { ThemeShape } from '..';

export interface ProgressBarProps {
  progress: number;
  color?: string;
  style?: any;
  theme?: ThemeShape;
}

export class ProgressBar extends React.Component<ProgressBarProps> {}
