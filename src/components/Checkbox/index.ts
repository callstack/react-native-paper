import CheckboxComponent from './Checkbox';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';
import CheckboxItem from './CheckboxItem';

const Checkbox = Object.assign(
  // @component ./Checkbox.tsx
  CheckboxComponent,
  {
    // @component ./CheckboxItem.tsx
    Item: CheckboxItem,
    // @component ./CheckboxAndroid.tsx
    Android: CheckboxAndroid,
    // @component ./CheckboxIOS.tsx
    IOS: CheckboxIOS,
  }
);

export default Checkbox;
