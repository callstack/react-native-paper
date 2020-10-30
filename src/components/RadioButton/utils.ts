export const handlePress = ({
  onPress,
  value,
  onValueChange,
}: {
  onPress?: () => void;
  value: string;
  onValueChange?: (value: string) => void;
}) => {
  onValueChange ? onValueChange(value) : onPress?.();
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
  if (contextValue) {
    return contextValue === value ? 'checked' : 'unchecked';
  } else {
    return status;
  }
};
