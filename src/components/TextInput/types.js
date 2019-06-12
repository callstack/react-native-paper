// @flow
import { TextInput as NativeTextInput, Animated } from 'react-native';
import type { TextInputProps } from './TextInput';

export type RenderProps = {
  ref: any => void,
  onChangeText: ?(string) => void,
  placeholder: ?string,
  placeholderTextColor: ?string,
  editable: ?boolean,
  selectionColor: ?string,
  onFocus: ?() => mixed,
  onBlur: ?() => mixed,
  underlineColorAndroid: ?string,
  style: any,
  multiline: ?boolean,
  numberOfLines: ?number,
  value: ?string,
};

type TextInputTypesWithoutMode = $Diff<
  TextInputProps,
  { mode?: 'flat' | 'outlined' }
>;

export type State = {
  labeled: Animated.Value,
  error: Animated.Value,
  focused: boolean,
  placeholder: ?string,
  value: ?string,
  labelLayout: {
    measured: boolean,
    width: number,
  },
};

export type ChildTextInputProps = {|
  ...TextInputTypesWithoutMode,
  parentState: State,
  innerRef: (ref: ?NativeTextInput) => void,
  onFocus?: (args: any) => void,
  onBlur?: (args: any) => void,
  onChangeText?: (value: string) => void,
  onLayoutAnimatedText?: (e: any) => void,
|};
