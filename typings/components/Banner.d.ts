import * as React from 'react';
import { ThemeShape } from '../types';
import { SurfaceProps } from './Surface';

export interface BannerAction {
  label: string;
  onPress: () => any;
}

export interface BannerProps extends SurfaceProps {
  visible: boolean;
  image?: (props: { size: number }) => React.ReactNode;
  actions: BannerAction[];
}

export declare class Banner extends React.Component<BannerProps> {}
