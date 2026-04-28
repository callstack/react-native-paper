import { Platform } from 'react-native';

// ==================
// PLATFORM
// ==================
export const isWeb = Platform.OS === 'web';

// =====================
// FIELD LAYOUT
// =====================
export const TEXT_FIELD_HEIGHT = 56;
export const TEXT_FIELD_PADDING_VERTICAL = 8;
export const TEXT_FIELD_INPUT_WRAPPER_PADDING_HORIZONTAL = 16;
export const TEXT_FIELD_ACCESSORY_MARGIN_HORIZONTAL = 12;

// ==================
// ACCESSORY
// ==================
export const ACCESSORY_SIZE = 24;

// ===============
// TYPOGRAPHY
// ===============
export const LINE_HEIGHT_DELTA = 2;
export const INPUT_FONT_SIZE = 16;
export const ACTIVE_LABEL_FONT_SIZE = 12;
export const INACTIVE_LABEL_FONT_SIZE = INPUT_FONT_SIZE;
export const HELPER_FONT_SIZE = 12;

export const INACTIVE_LABEL_TOP_POSITION =
  (TEXT_FIELD_HEIGHT -
    2 * TEXT_FIELD_PADDING_VERTICAL -
    INACTIVE_LABEL_FONT_SIZE) /
    2 +
  TEXT_FIELD_PADDING_VERTICAL -
  LINE_HEIGHT_DELTA;

// =================
// HELPER TEXT LAYOUT
// =================
export const HELPER_MARGIN_TOP = 4;

// =========
// ANIMATION
// =========
export const ANIMATION_DURATION_MS = 150;

// =========
// INDICATOR
// =========
export const ACTIVE_INDICATOR_SIZE = 2;
export const INACTIVE_INDICATOR_SIZE = 1;

// ============
// SHAPE
// ============
export const TEXT_FIELD_BORDER_RADIUS = 4;
