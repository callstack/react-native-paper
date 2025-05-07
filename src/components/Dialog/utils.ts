import { StyleProp, ViewStyle } from 'react-native';

export type DialogChildProps = {
  style?: StyleProp<ViewStyle>;
};

export type DialogActionChildProps = DialogChildProps & {
  compact?: boolean;
  uppercase?: boolean;
};
