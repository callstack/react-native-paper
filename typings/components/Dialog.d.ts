import * as React from 'react';
import { ThemeShape } from '..';

export interface DialogContentProps {
  children: React.ReactNode;
  style?: any;
}

class DialogContent extends React.Component<DialogContentProps> {}

export interface DialogActionsProps {
  children: React.ReactNode;
  style?: any;
}

class DialogActions extends React.Component<DialogActionsProps> {}

export interface DialogTitleProps {
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

class DialogTitle extends React.Component<DialogTitleProps> {}

export interface DialogScrollAreaProps {
  children: React.ReactNode;
  style?: any;
}

class DialogScrollArea extends React.Component<DialogScrollAreaProps> {}

export interface DialogProps {
  dismissable?: boolean;
  onDismiss?: () => any;
  visible: boolean;
  children: React.ReactNode;
  style?: any;
  theme?: ThemeShape;
}

export class Dialog extends React.Component<DialogProps> {
  static Content: DialogContent;
  static Actions: DialogActions;
  static Title: DialogTitle;
  static ScrollArea: DialogScrollArea;
}
