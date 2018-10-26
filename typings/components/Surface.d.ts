import * as React from 'react';
import { ViewProps } from 'react-native';
import { ThemeShape } from '../types';

export interface SurfaceProps extends ViewProps {
  children: React.ReactNode;
  theme?: ThemeShape;
}

export declare class Surface extends React.Component<SurfaceProps> {}
