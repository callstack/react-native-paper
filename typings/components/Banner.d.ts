import * as React from 'react';
import { ThemeShape } from '../types';

export interface BannerAction {
  label: string;
  onPress: () => any;
}

export interface BannerProps {
  visible: boolean;
  children: React.ReactNode;
  image?: (props: { size: number }) => React.ReactNode;
  actions: Array<BannerAction>;
  style?: any;
  theme?: ThemeShape;
}

export declare class Banner extends React.Component<BannerProps> {}
