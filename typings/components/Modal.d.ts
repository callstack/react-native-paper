import * as React from 'react';
import { ThemeShape } from '../types';

export interface ModalProps {
  dismissable?: boolean;
  onDismiss: () => any;
  visible: boolean;
  transitionDuration: number | {enter: number, exit: number},
  children: React.ReactNode;
  theme?: ThemeShape;
}

export declare class Modal extends React.Component<ModalProps> {}
