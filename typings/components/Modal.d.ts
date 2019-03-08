import * as React from 'react';
import { ThemeShape } from '../types';

export interface ModalProps {
  dismissable?: boolean;
  onDismiss?: () => any;
  visible: boolean;
  children: React.ReactNode;
  theme?: ThemeShape;
  wrapperStyle?: StyleSheet;
}

export declare class Modal extends React.Component<ModalProps> {}
