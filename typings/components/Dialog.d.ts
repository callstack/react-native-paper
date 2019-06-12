import * as React from 'react';
import { ThemeShape } from '../types';

interface DialogBaseProps {
  children: React.ReactNode;
  style?: any;
}

export interface DialogContentProps extends DialogBaseProps {}
export interface DialogActionsProps extends DialogBaseProps {}
export interface DialogScrollAreaProps extends DialogBaseProps {}
export interface DialogTitleProps extends DialogBaseProps {
  theme?: ThemeShape;
}

export interface DialogProps {
  dismissable?: boolean;
  onDismiss?: () => any;
  visible: boolean;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export declare class Dialog extends React.Component<DialogProps> {
  static Content: React.ComponentType<DialogContentProps>;
  static Actions: React.ComponentType<DialogActionsProps>;
  static Title: React.ComponentType<DialogTitleProps>;
  static ScrollArea: React.ComponentType<DialogScrollAreaProps>;
}
