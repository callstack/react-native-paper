import { TextStyle, ViewStyle } from 'react-native';

import {
  TEXT_FIELD_BORDER_RADIUS,
  TEXT_FIELD_HEIGHT,
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  TEXT_FIELD_PADDING_VERTICAL,
} from '../constants';
import { LABEL_PADDING_HORIZONTAL } from './constants';

export const $fieldStyle: ViewStyle = {
  minHeight: TEXT_FIELD_HEIGHT,
  flexDirection: 'row',
  paddingVertical: TEXT_FIELD_PADDING_VERTICAL,
  borderRadius: TEXT_FIELD_BORDER_RADIUS,
};

export const $outlineStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  borderRadius: TEXT_FIELD_BORDER_RADIUS,
};

export const $containerStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  justifyContent: 'center',
};

export const $labelWrapperStyle: ViewStyle = {
  position: 'absolute',
  paddingHorizontal: LABEL_PADDING_HORIZONTAL,
};

export const $labelTextStyle: TextStyle = {
  fontWeight: '400',
  includeFontPadding: false,
  paddingVertical: 0,
  paddingHorizontal: 0,
};
