export const handlePress = ({
  onPress,
  value,
  onValueChange,
}: {
  onPress?: () => void;
  value: string | number;
  onValueChange?: (value: string | number) => void;
}) => {
  onValueChange ? onValueChange(value) : onPress?.();
};

export const isChecked = ({
  value,
  status,
  contextValue,
}: {
  value: string | number;
  status?: 'checked' | 'unchecked';
  contextValue?: string | number;
}) => {
  if (contextValue) {
    return contextValue === value ? 'checked' : 'unchecked';
  } else {
    return status;
  }
};
