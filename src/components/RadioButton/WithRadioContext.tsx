import React, { useContext } from 'react';
import { RadioButtonContext } from './RadioButtonGroup';

type Props = {
  /**
   * Value of the radio button
   */
  value: string;
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked';
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Custom color for unchecked radio.
   */
  uncheckedColor?: string;
  /**
   * Custom color for radio.
   */
  color?: string;
};

const withRadioContext = (RadioComponent: React.ComponentType<Props>) => {
  return (props: Props) => {
    const context = useContext(RadioButtonContext);

    const handlePress = () => {
      const { onPress, value } = props;

      context ? context.onValueChange(value) : onPress && onPress();
    };

    const isChecked = () => {
      const { value, status } = props;

      if (context) {
        return context.value === value ? 'checked' : 'unchecked';
      } else {
        return status;
      }
    };

    return (
      <RadioComponent {...props} status={isChecked()} onPress={handlePress} />
    );
  };
};

export default withRadioContext;
