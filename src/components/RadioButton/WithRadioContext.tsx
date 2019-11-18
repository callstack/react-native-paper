import React, { useContext } from 'react';
import { RadioButtonContext } from './RadioButtonGroup';
import { Props } from './RadioButton';

const withRadioContext = (
  RadioComponent: React.ComponentType<Omit<Props, 'theme'>>
) => {
  return (props: Omit<Props, 'theme'>) => {
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
