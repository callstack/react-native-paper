import React from 'react';
import { RadioButtonContext, RadioButtonContextType } from './RadioButtonGroup';
import { Props } from './RadioButton';

const withRadioContext = (
  RadioComponent: React.ComponentType<Omit<Props, 'theme'>>
) => {
  return (props: Omit<Props, 'theme'>) => {
    return (
      <RadioButtonContext.Consumer>
        {(context: RadioButtonContextType) => {
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
            <RadioComponent
              {...props}
              status={isChecked()}
              onPress={handlePress}
            />
          );
        }}
      </RadioButtonContext.Consumer>
    );
  };
};

export default withRadioContext;
