import * as React from 'react';
import { ThemeShape, IconSource } from '../types';
import { TouchableRipplePropsWithoutChildren } from './TouchableRipple';

export interface IconButtonProps extends TouchableRipplePropsWithoutChildren {
  icon: IconSource;
  color?: string;
  size?: number;
  animated?: boolean;
}

export declare class IconButton extends React.Component<IconButtonProps> {}
