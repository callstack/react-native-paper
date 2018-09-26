import * as React from 'react';
import { ThemeShape } from '..';

export interface HelperTextProps {
  type: 'error' | 'info';
  visible?: boolean;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export class HelperText extends React.Component<HelperTextProps> {}
