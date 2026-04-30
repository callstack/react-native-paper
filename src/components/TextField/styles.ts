import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import {
  ACCESSORY_SIZE,
  SUPPORTING_TEXT_FONT_SIZE,
  SUPPORTING_TEXT_MARGIN_TOP,
  TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
} from './constants';
import { tokens } from '../../styles/themes/v3/tokens';

export const $pressableStyle: ViewStyle = {};

export const $inputStyle: StyleProp<TextStyle> = {
  paddingVertical: 0,
  paddingHorizontal: 0,
  includeFontPadding: false,
  fontWeight: '400',
};

export const $supportingTextStyle: TextStyle = {
  marginTop: SUPPORTING_TEXT_MARGIN_TOP,
  paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  fontSize: SUPPORTING_TEXT_FONT_SIZE,
  fontWeight: '400',
  textAlign: 'left',
};

export const $trailingAccessoryStyle: ViewStyle = {
  width: ACCESSORY_SIZE,
  marginEnd: TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  justifyContent: 'center',
  alignItems: 'center',
};

export const $leadingAccessoryStyle: ViewStyle = {
  width: ACCESSORY_SIZE,
  marginStart: TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  justifyContent: 'center',
  alignItems: 'center',
};

export const $disabledStyle: ViewStyle = {
  opacity: tokens.md.ref.stateOpacity.disabled,
};

export const $iconWrapperStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
};

export const $iconStyle: ViewStyle = {
  margin: 0,
};
