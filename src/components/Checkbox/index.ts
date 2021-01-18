import CheckboxComponent from './Checkbox';
import CheckboxItem from './CheckboxItem';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';

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
