import { TextStyle, ViewStyle } from 'react-native';

import {
  TEXT_FIELD_BORDER_RADIUS,
  TEXT_FIELD_HEIGHT,
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  TEXT_FIELD_PADDING_VERTICAL,
} from '../constants';
import { DISABLED_CONTAINER_OPACITY } from './constants';

export const $fieldStyle: ViewStyle = {
  minHeight: TEXT_FIELD_HEIGHT,
  flexDirection: 'row',
  paddingVertical: TEXT_FIELD_PADDING_VERTICAL,
  borderTopStartRadius: TEXT_FIELD_BORDER_RADIUS,
  borderTopEndRadius: TEXT_FIELD_BORDER_RADIUS,
};

export const $outlineStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
};

export const $containerStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  justifyContent: 'flex-end',
};

export const $labelWrapperStyle: ViewStyle = {
  position: 'absolute',
};

export const $labelTextStyle: TextStyle = {
  fontWeight: '400',
  includeFontPadding: false,
  paddingVertical: 0,
  paddingHorizontal: 0,
};

export const $disabledBackgroundStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: DISABLED_CONTAINER_OPACITY,
  borderTopStartRadius: TEXT_FIELD_BORDER_RADIUS,
  borderTopEndRadius: TEXT_FIELD_BORDER_RADIUS,
};
