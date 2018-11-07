import * as React from 'react';
import { ThemeShape } from '../types';

export interface PortalProps {
  children: React.ReactNode;
  theme?: ThemeShape;
}

export class Portal extends React.Component<PortalProps> {
  static Host: React.ComponentType<{ children: React.ReactNode }>;
}
