import type {
  TextInput as NativeTextInput,
  Animated,
  TextStyle,
  LayoutChangeEvent,
  ColorValue,
  StyleProp,
  ViewProps,
} from 'react-native';

import type { $Omit, InternalTheme, ThemeProp } from './../../types';
import type { Props as TextInputProps } from './TextInput';

export type TextInputLabelProp = string | React.ReactElement;

export type RenderProps = {
  ref: (a?: NativeTextInput | null) => void;
  onChangeText?: (a: string) => void;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  editable?: boolean;
  selectionColor?: string;
  cursorColor?: string;
  onFocus?: (args: any) => void;
  onBlur?: (args: any) => void;
  underlineColorAndroid?: string;
  style: any;
  multiline?: boolean;
  numberOfLines?: number;
  value?: string;
  adjustsFontSizeToFit?: boolean;
  testID?: string;
};
type TextInputTypesWithoutMode = $Omit<TextInputProps, 'mode'>;
export type State = {
  labeled: Animated.Value;
  error: Animated.Value;
  focused: boolean;
  placeholder?: string;
  value?: string;
  labelLayout: { measured: boolean; width: number; height: number };
  leftLayout: { height: number | null; width: number | null };
  rightLayout: { height: number | null; width: number | null };
  contentStyle?: StyleProp<ViewProps>;
};
export type ChildTextInputProps = {
  parentState: State;
  innerRef: (ref?: NativeTextInput | null) => void;
  onFocus?: (args: any) => void;
  onBlur?: (args: any) => void;
  forceFocus: () => void;
  onChangeText?: (value: string) => void;
  onLayoutAnimatedText: (args: any) => void;
  onLeftAffixLayoutChange: (event: LayoutChangeEvent) => void;
  onRightAffixLayoutChange: (event: LayoutChangeEvent) => void;
} & $Omit<TextInputTypesWithoutMode, 'theme'> & { theme: InternalTheme };

export type LabelProps = {
  mode?: 'flat' | 'outlined';
  placeholderStyle: any;
  placeholderOpacity:
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation<number>;
  baseLabelTranslateX: number;
  baseLabelTranslateY: number;
  wiggleOffsetX: number;
  labelScale: number;
  fontSize: number;
  lineHeight?: number | undefined;
  fontWeight: TextStyle['fontWeight'];
  font: any;
  topPosition: number;
  paddingLeft?: number;
  paddingRight?: number;
  labelTranslationXOffset?: number;
  placeholderColor: string | null;
  backgroundColor?: ColorValue;
  label?: TextInputLabelProp | null;
  hasActiveOutline?: boolean | null;
  activeColor: string;
  errorColor?: string;
  labelError?: boolean | null;
  onLayoutAnimatedText: (args: any) => void;
  roundness: number;
  maxFontSizeMultiplier?: number | undefined | null;
  testID?: string;
  contentStyle?: StyleProp<ViewProps>;
  theme?: ThemeProp;
};
export type InputLabelProps = {
  labeled: Animated.Value;
  error: Animated.Value;
  focused: boolean;
  wiggle: boolean;
  opacity: number;
  labelLayoutMeasured: boolean;
  labelLayoutWidth: number;
  labelBackground?: any;
  maxFontSizeMultiplier?: number | undefined | null;
} & LabelProps;

export type LabelBackgroundProps = {
  labelStyle: any;
  labeled: Animated.Value;
  labelLayoutWidth: number;
  maxFontSizeMultiplier?: number | undefined | null;
  theme?: ThemeProp;
} & LabelProps;
