import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ThemeShape } from '../types';

export interface ModalProps {
  dismissable?: boolean;
  onDismiss?: () => any;
  visible: boolean;
  children: React.ReactNode;
  theme?: ThemeShape;
  wrapperStyle?: StyleSheet.NamedStyles<ViewStyle>;
}

export declare class Modal extends React.Component<ModalProps> {}
