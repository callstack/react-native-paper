import * as React from 'react';
import type {
  TextInput as NativeTextInput,
  Animated,
  TextStyle,
  LayoutChangeEvent,
  ColorValue,
  StyleProp,
  ViewProps,
  ViewStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

import type { $Omit, InternalTheme, ThemeProp } from './../../types';

export type TextInputLabelProp = string | React.ReactElement;

type TextInputProps = React.ComponentPropsWithRef<typeof NativeTextInput> & {
  mode?: 'flat' | 'outlined';
  left?: React.ReactNode;
  right?: React.ReactNode;
  disabled?: boolean;
  label?: TextInputLabelProp;
  placeholder?: string;
  error?: boolean;
  onChangeText?: Function;
  selectionColor?: string;
  cursorColor?: string;
  underlineColor?: string;
  activeUnderlineColor?: string;
  outlineColor?: string;
  activeOutlineColor?: string;
  textColor?: string;
  dense?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  onFocus?: (args: any) => void;
  onBlur?: (args: any) => void;
  render?: (props: RenderProps) => React.ReactNode;
  value?: string;
  style?: StyleProp<TextStyle>;
  theme?: ThemeProp;
  testID?: string;
  contentStyle?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  underlineStyle?: StyleProp<ViewStyle>;
};

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
  onLayout?: (args: any) => void;
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
  labelTextLayout: { width: number };
  labelLayout: { measured: boolean; width: number; height: number };
  leftLayout: { height: number | null; width: number | null };
  rightLayout: { height: number | null; width: number | null };
  inputContainerLayout: { width: number };
  contentStyle?: StyleProp<ViewProps>;
};
export type ChildTextInputProps = {
  parentState: State;
  innerRef: (ref?: NativeTextInput | null) => void;
  onFocus?: (args: any) => void;
  onBlur?: (args: any) => void;
  forceFocus: () => void;
  onChangeText?: (value: string) => void;
  onInputLayout: (event: LayoutChangeEvent) => void;
  onLayoutAnimatedText: (args: any) => void;
  onLabelTextLayout: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
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
  onLabelTextLayout: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
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
  inputContainerLayout: { width: number };
  labelBackground?: any;
  maxFontSizeMultiplier?: number | undefined | null;
  isV3?: boolean;
} & LabelProps;

export type LabelBackgroundProps = {
  labelStyle: any;
  labeled: Animated.Value;
  labelLayoutWidth: number;
  maxFontSizeMultiplier?: number | undefined | null;
  theme?: ThemeProp;
} & LabelProps;
