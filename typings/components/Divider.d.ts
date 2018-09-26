import * as React from 'react';
import { ThemeShape } from '..';

export interface DividerProps {
  inset?: boolean;
  style?: any;
  theme?: ThemeShape;
}

export class Divider extends React.Component<DividerProps> {}
