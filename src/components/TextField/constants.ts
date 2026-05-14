import { I18nManager, PixelRatio, Platform } from 'react-native';

import { tokens } from '../../theme/tokens';
import { motionDuration } from '../../theme/tokens/sys/motion';
import { defaultShapes } from '../../theme/tokens/sys/shape';

export const isWeb = Platform.OS === 'web';

export const fontScale = PixelRatio.getFontScale();

/**
 * Common constants for the text field component.
 */

export const BASELINE_TEXT_FIELD_HEIGHT = 56;
export const BASELINE_TEXT_FIELD_PADDING_VERTICAL = 8;

export const TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL = 16;
export const TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL = 12;

export const TEXT_FIELD_HEIGHT = BASELINE_TEXT_FIELD_HEIGHT * fontScale;
export const TEXT_FIELD_PADDING_VERTICAL =
  BASELINE_TEXT_FIELD_PADDING_VERTICAL * fontScale;

export const TEXT_FIELD_BORDER_RADIUS = defaultShapes.corner.extraSmall;

export const LABEL_START_OFFSET_WITHOUT_ACCESSORY =
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL;

export const ACCESSORY_SIZE = 24;

export const PREFIX_END_PADDING = 2;
export const SUFFIX_START_PADDING = 2;

export const ERROR_ICON_SIZE = 16;

export const LINE_HEIGHT_DELTA = 2;
export const INPUT_FONT_SIZE = tokens.md.sys.typescale.bodyLarge.fontSize;
export const ACTIVE_LABEL_FONT_SIZE =
  tokens.md.sys.typescale.bodySmall.fontSize;
export const INACTIVE_LABEL_FONT_SIZE = INPUT_FONT_SIZE;
export const SUPPORTING_TEXT_FONT_SIZE =
  tokens.md.sys.typescale.bodySmall.fontSize;

export const INACTIVE_LABEL_TOP_POSITION =
  ((BASELINE_TEXT_FIELD_HEIGHT -
    2 * BASELINE_TEXT_FIELD_PADDING_VERTICAL -
    INPUT_FONT_SIZE) /
    2 +
    BASELINE_TEXT_FIELD_PADDING_VERTICAL -
    LINE_HEIGHT_DELTA) *
  fontScale;

export const SUPPORTING_TEXT_MARGIN_TOP = 4;

export const ANIMATION_DURATION_MS = motionDuration.short3;

export const ACTIVE_INDICATOR_SIZE = 2;
export const INACTIVE_INDICATOR_SIZE = 1;

const isRTL = I18nManager.getConstants().isRTL;
const layoutSupportMultiplier = isRTL ? -1 : 1;

/**
 * Constants for the filled variant.
 */

export const FILLED_LABEL_START_OFFSET_WITH_ACCESSORY =
  ACCESSORY_SIZE +
  TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL +
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL;

export const FILLED_ACTIVE_LABEL_TOP_POSITION = TEXT_FIELD_PADDING_VERTICAL;

export const FILLED_MULTILINE_PADDING_TOP =
  ACTIVE_LABEL_FONT_SIZE * fontScale + TEXT_FIELD_PADDING_VERTICAL;

export const FILLED_DISABLED_CONTAINER_OPACITY = 0.04;

/**
 * Constants for the outlined variant.
 */

export const OUTLINED_DISABLED_OUTLINE_OPACITY = 0.12;

export const OUTLINED_MULTILINE_PADDING_TOP =
  ((BASELINE_TEXT_FIELD_HEIGHT -
    2 * BASELINE_TEXT_FIELD_PADDING_VERTICAL -
    INPUT_FONT_SIZE) /
    2 -
    LINE_HEIGHT_DELTA) *
  fontScale;

export const OUTLINED_LABEL_PADDING_HORIZONTAL = 4;

export const OUTLINED_LABEL_START_OFFSET_WITH_ACCESSORY =
  ACCESSORY_SIZE +
  TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL +
  TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL -
  OUTLINED_LABEL_PADDING_HORIZONTAL;

export const OUTLINED_ACTIVE_LABEL_TOP_POSITION =
  (-BASELINE_TEXT_FIELD_PADDING_VERTICAL + LINE_HEIGHT_DELTA) * fontScale;

export const OUTLINED_LABEL_TRANSLATE_X_WITH_ACCESSORY =
  -layoutSupportMultiplier *
  (ACCESSORY_SIZE +
    TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL -
    OUTLINED_LABEL_PADDING_HORIZONTAL);

export const OUTLINED_LABEL_TRANSLATE_X_WITHOUT_ACCESSORY =
  -layoutSupportMultiplier * OUTLINED_LABEL_PADDING_HORIZONTAL;
