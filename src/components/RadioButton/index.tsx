import { RadioButton as _RadioButton } from './RadioButton';

import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonIOS from './RadioButtonIOS';
import RadioButtonItem from './RadioButtonItem';

import { withTheme } from '../../core/theming';

export class RadioButton extends _RadioButton {
  // @component ./RadioButtonGroup.tsx
  static Group = RadioButtonGroup;
  // @component ./RadioButtonAndroid.tsx
  static Android = RadioButtonAndroid;
  // @component ./RadioButtonIOS.tsx
  static IOS = RadioButtonIOS;
  // @component ./RadioButtonItem.tsx
  static Item = RadioButtonItem;
}

export default withTheme(RadioButton);
