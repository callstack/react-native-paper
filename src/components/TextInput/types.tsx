import { TextInput as NativeTextInput, Animated } from 'react-native';
import { TextInputProps } from './TextInput';

export type RenderProps = {
  ref: (a: any) => undefined;
  onChangeText: (a: string) => undefined | null | undefined;
  placeholder: string | null | undefined;
  placeholderTextColor: string | null | undefined;
  editable: boolean | null | undefined;
  selectionColor: string | null | undefined;
  onFocus: () => unknown | null | undefined;
  onBlur: () => unknown | null | undefined;
  underlineColorAndroid: string | null | undefined;
  style: any;
  multiline: boolean | null | undefined;
  numberOfLines: number | null | undefined;
  value: string | null | undefined;
};
type TextInputTypesWithoutMode = Omit<
  TextInputProps,
  'mode'
>;
export type State = {
  labeled: Animated.Value;
  error: Animated.Value;
  focused: boolean;
  placeholder: string | null | undefined;
  value: string | null | undefined;
  labelLayout: { measured: boolean; width: number; height: number };
};
export type ChildTextInputProps = {
  parentState: State;
  innerRef: (ref: NativeTextInput | null | undefined) => undefined;
  onFocus?: (args: any) => undefined;
  onBlur?: (args: any) => undefined;
  onChangeText?: (value: string) => undefined;
  onLayoutAnimatedText?: (e: any) => undefined;
} & TextInputTypesWithoutMode;
export type LabelProps = {
  placeholderStyle: any;
  placeholderOpacity: number | Animated.Value;
  baseLabelTranslateX: number;
  baseLabelTranslateY: number;
  wiggleOffsetX: number;
  labelScale: number;
  fontSize: number;
  font: any;
  topPosition: number;
  paddingOffset?: { paddingHorizontal: number } | null | undefined;
  placeholderColor: string | null | undefined;
  label?: string | null | undefined;
  hasActiveOutline: boolean | null | undefined;
  activeColor: string;
  onLayoutAnimatedText: () => unknown | null | undefined;
  error: boolean | null | undefined;
};
export type InputLabelProps = { parentState: State; labelProps: LabelProps };
