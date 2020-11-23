import CheckBox from './Checkbox';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';
import CheckboxItem from './CheckboxItem';

export default Object.assign(CheckBox, {
  Item: CheckboxItem,
  Android: CheckboxAndroid,
  IOS: CheckboxIOS,
});
