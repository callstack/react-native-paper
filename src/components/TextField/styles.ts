import { StyleSheet } from 'react-native';

import {
  ACCESSORY_SIZE,
  FILLED_DISABLED_CONTAINER_OPACITY,
  OUTLINED_LABEL_PADDING_HORIZONTAL,
  SUPPORTING_TEXT_FONT_SIZE,
  SUPPORTING_TEXT_MARGIN_TOP,
  TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  TEXT_FIELD_BORDER_RADIUS,
  TEXT_FIELD_HEIGHT,
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  TEXT_FIELD_PADDING_VERTICAL,
} from './constants';
import { tokens } from '../../theme/tokens';

const { bodyLarge, bodySmall } = tokens.md.sys.typescale;

export const styles = StyleSheet.create({
  input: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
    fontWeight: bodyLarge.fontWeight,
  },
  field: {
    flexDirection: 'row',
    minHeight: TEXT_FIELD_HEIGHT,
    paddingVertical: TEXT_FIELD_PADDING_VERTICAL,
  },
  addendum: {
    flexDirection: 'row',
  },
  supportingText: {
    flex: 1,
    marginTop: SUPPORTING_TEXT_MARGIN_TOP,
    paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
    fontSize: SUPPORTING_TEXT_FONT_SIZE,
    fontWeight: bodySmall.fontWeight,
    textAlign: 'left',
  },
  counter: {
    marginTop: SUPPORTING_TEXT_MARGIN_TOP,
    marginStart: 'auto',
    paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
    fontSize: SUPPORTING_TEXT_FONT_SIZE,
    fontWeight: bodySmall.fontWeight,
    textAlign: 'right',
  },
  trailingAccessory: {
    width: ACCESSORY_SIZE,
    height: ACCESSORY_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  },
  leadingAccessory: {
    width: ACCESSORY_SIZE,
    height: ACCESSORY_SIZE,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL,
  },
  disabled: {
    opacity: tokens.md.ref.stateOpacity.disabled,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
  },
});

export const filledStyles = StyleSheet.create({
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  },
  labelWrapper: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  disabledBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: FILLED_DISABLED_CONTAINER_OPACITY,
    pointerEvents: 'none',
  },
});

export const outlinedStyles = StyleSheet.create({
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: TEXT_FIELD_BORDER_RADIUS,
    pointerEvents: 'none',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL,
  },
  labelWrapper: {
    position: 'absolute',
    paddingHorizontal: OUTLINED_LABEL_PADDING_HORIZONTAL,
    pointerEvents: 'none',
  },
});
