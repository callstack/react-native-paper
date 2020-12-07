import type { GestureResponderEvent } from 'react-native';

export const handlePress = ({
  onPress,
  value,
  onValueChange,
  event,
}: {
  onPress?: (event: GestureResponderEvent) => void;
  value: string;
  onValueChange?: (value: string) => void;
  event: GestureResponderEvent;
}) => {
  onValueChange ? onValueChange(value) : onPress?.(event);
};

export const isChecked = ({
  value,
  status,
  contextValue,
}: {
  value: string;
  status?: 'checked' | 'unchecked';
  contextValue?: string;
}) => {
  if (contextValue !== undefined && contextValue !== null) {
    return contextValue === value ? 'checked' : 'unchecked';
  } else {
    return status;
  }
};
