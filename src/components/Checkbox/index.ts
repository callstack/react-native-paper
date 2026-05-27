import CheckboxComponent from './Checkbox';
import CheckboxItem from './CheckboxItem';

const Checkbox = Object.assign(
  // @component ./Checkbox.tsx
  CheckboxComponent,
  {
    // @component ./CheckboxItem.tsx
    Item: CheckboxItem,
  }
);

export default Checkbox;
