import * as React from 'react';
import { ThemeShape } from '..';

export interface ModalProps {
  dismissable?: boolean;
  onDismiss?: () => any;
  visible: boolean;
  children: React.ReactNode;
  theme?: ThemeShape;
}

export class Modal extends React.Component<ModalProps> {}
