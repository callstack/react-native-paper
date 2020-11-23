import RadioButton from './RadioButton';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonIOS from './RadioButtonIOS';
import RadioButtonItem from './RadioButtonItem';

export default Object.assign(RadioButton, {
  Group: RadioButtonGroup,
  Android: RadioButtonAndroid,
  IOS: RadioButtonIOS,
  Item: RadioButtonItem,
});
