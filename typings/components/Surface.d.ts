import * as React from 'react';
import { ThemeShape } from '..';

export interface SurfaceProps {
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export class Surface extends React.Component<SurfaceProps> {}
