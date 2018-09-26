import * as React from 'react';
import { ThemeShape } from '..';

export interface PortalProps {
  children: React.ReactNode;
  theme?: ThemeShape;
}

export class Portal extends React.Component<PortalProps> {}
