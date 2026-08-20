import * as React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export const DialogTitleIdContext = React.createContext<string | undefined>(
  undefined
);

export type DialogChildProps = {
  style?: StyleProp<ViewStyle | TextStyle>;
};
