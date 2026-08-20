import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type DialogChildProps = {
  style?: StyleProp<ViewStyle | TextStyle>;
};

export type DialogActionChildProps = DialogChildProps & {
  compact?: boolean;
  uppercase?: boolean;
};
