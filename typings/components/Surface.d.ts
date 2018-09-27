import * as React from 'react';
import { ThemeShape } from '../types';

export interface SurfaceProps {
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class Surface extends React.Component<SurfaceProps> {}
