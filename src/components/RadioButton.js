import { Platform } from 'react-native';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonIOS from './RadioButtonIOS';

const RadioButton = Platform.OS === 'ios' ? RadioButtonIOS : RadioButtonAndroid;

export default RadioButton;
