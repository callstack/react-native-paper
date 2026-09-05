import RadioButtonComponent from './RadioButton';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonItem from './RadioButtonItem';

const RadioButton = Object.assign(
  // @component ./RadioButton.tsx
  RadioButtonComponent,
  {
    // @component ./RadioButtonGroup.tsx
    Group: RadioButtonGroup,
    // @component ./RadioButtonItem.tsx
    Item: RadioButtonItem,
  }
);

export default RadioButton;
