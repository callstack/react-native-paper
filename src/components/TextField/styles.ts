import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import {
  ACCESSORY_SIZE,
  HELPER_FONT_SIZE,
  HELPER_MARGIN_TOP,
  TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
} from './constants';
import { tokens } from '../../styles/themes/v3/tokens';

export const $pressableStyle: ViewStyle = {};

export const $inputStyle: StyleProp<TextStyle> = {
  fontWeight: '400',
  includeFontPadding: false,
  paddingVertical: 0,
  paddingHorizontal: 0,
};

export const $supportingTextStyle: TextStyle = {
  marginTop: HELPER_MARGIN_TOP,
  paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  fontSize: HELPER_FONT_SIZE,
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
