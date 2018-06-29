import { Platform } from 'react-native';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';

const Checkbox = Platform.OS === 'ios' ? CheckboxIOS : CheckboxAndroid;

export default Checkbox;
