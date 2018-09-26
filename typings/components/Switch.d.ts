import * as React from 'react';
import { ThemeShape } from '..';

export interface SwitchProps {
  disabled?: boolean;
  value?: boolean;
  color?: string;
  onValueChange?: Function;
  style?: any;
  theme?: ThemeShape;
}

export class Switch extends React.Component<SwitchProps> {}
