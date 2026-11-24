import { Easing } from 'react-native-reanimated';

import { tokens } from '../../theme/tokens';
import { motionDuration, motionEasing } from '../../theme/tokens/sys/motion';
import { defaultShapes } from '../../theme/tokens/sys/shape';

/**
 * Common constants for the text input component.
 */

export const BASELINE_TEXT_INPUT_HEIGHT = 56;
export const BASELINE_TEXT_INPUT_PADDING_VERTICAL = 8;

export const TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL = 16;
export const TEXT_INPUT_ACCESSORY_MARGIN_HORIZONTAL = 12;

export const TEXT_INPUT_BORDER_RADIUS = defaultShapes.corner.extraSmall;

export const LABEL_START_OFFSET_WITHOUT_ACCESSORY =
  TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL;

export const ACCESSORY_SIZE = 24;

export const PREFIX_END_PADDING = 2;
export const SUFFIX_START_PADDING = 2;

export const ERROR_ICON_SIZE = 16;

export const INPUT_FONT_SIZE = tokens.md.sys.typescale.bodyLarge.fontSize;
export const ACTIVE_LABEL_FONT_SIZE =
  tokens.md.sys.typescale.bodySmall.fontSize;
export const INACTIVE_LABEL_FONT_SIZE = INPUT_FONT_SIZE;
export const SUPPORTING_TEXT_FONT_SIZE =
  tokens.md.sys.typescale.bodySmall.fontSize;

export const SUPPORTING_TEXT_MARGIN_TOP = 4;

export const ANIMATION_DURATION_MS = motionDuration.short3;

// How long an error must stay unchanged before Android and iOS announce it.
export const ERROR_ANNOUNCEMENT_DELAY_MS = 1000;

export const ACTIVE_INDICATOR_SIZE = 2;
export const INACTIVE_INDICATOR_SIZE = 1;

export const TIMING_CONFIG = {
  duration: ANIMATION_DURATION_MS,
  easing: Easing.bezier(...motionEasing.standard),
} as const;

/**
 * Constants for the filled variant.
 */

const FILLED_LINE_HEIGHT_DELTA = 3;

export const FILLED_LABEL_START_OFFSET_WITH_ACCESSORY =
  ACCESSORY_SIZE +
  TEXT_INPUT_ACCESSORY_MARGIN_HORIZONTAL +
  TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL;

export const FILLED_DISABLED_CONTAINER_OPACITY = 0.04;

/**
 * Constants for the outlined variant.
 */

const OUTLINED_LINE_HEIGHT_DELTA = 2;

export const OUTLINED_DISABLED_OUTLINE_OPACITY = 0.12;

export const OUTLINED_LABEL_PADDING_HORIZONTAL = 4;

export const OUTLINED_LABEL_START_OFFSET_WITH_ACCESSORY =
  ACCESSORY_SIZE +
  TEXT_INPUT_ACCESSORY_MARGIN_HORIZONTAL +
  TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL -
  OUTLINED_LABEL_PADDING_HORIZONTAL;

/** Positive distance; apply sign in animation using `isRTL` from `useLocale`. */
export const OUTLINED_LABEL_TRANSLATE_DISTANCE_WITH_ACCESSORY =
  ACCESSORY_SIZE +
  TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL -
  OUTLINED_LABEL_PADDING_HORIZONTAL;

/** Positive distance; apply sign in animation using `isRTL` from `useLocale`. */
export const OUTLINED_LABEL_TRANSLATE_DISTANCE_WITHOUT_ACCESSORY =
  OUTLINED_LABEL_PADDING_HORIZONTAL;

/**
 * Label end offsets, measured from the field's end edge to the end of the
 * input text, so a long label is cut off where the text is.
 */
export const LABEL_END_OFFSET_WITHOUT_ACCESSORY =
  TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL;

export const LABEL_END_OFFSET_WITH_ACCESSORY =
  ACCESSORY_SIZE +
  TEXT_INPUT_ACCESSORY_MARGIN_HORIZONTAL +
  TEXT_INPUT_INPUT_WRAPPER_PADDING_HORIZONTAL;

// Space between the input text and the resting label, scaled with the text.
const BASELINE_INACTIVE_LABEL_OFFSET =
  (BASELINE_TEXT_INPUT_HEIGHT -
    2 * BASELINE_TEXT_INPUT_PADDING_VERTICAL -
    INPUT_FONT_SIZE) /
    2 +
  BASELINE_TEXT_INPUT_PADDING_VERTICAL;

/**
 * Sizes that grow with the user's text size. Read the current `fontScale`
 * from `useWindowDimensions` so a text size change while the app runs resizes
 * the field.
 */
export const getTextInputMetrics = (fontScale: number) => {
  const paddingVertical = Math.ceil(
    BASELINE_TEXT_INPUT_PADDING_VERTICAL * fontScale
  );

  return {
    height: Math.ceil(BASELINE_TEXT_INPUT_HEIGHT * fontScale),
    paddingVertical,
    filled: {
      activeLabelTop: paddingVertical,
      inactiveLabelTop: Math.ceil(BASELINE_INACTIVE_LABEL_OFFSET * fontScale),
      multilinePaddingTop:
        Math.ceil(ACTIVE_LABEL_FONT_SIZE * fontScale) + paddingVertical,
      paddingBottom: paddingVertical + FILLED_LINE_HEIGHT_DELTA,
    },
    outlined: {
      activeLabelTop: Math.ceil(
        (-BASELINE_TEXT_INPUT_PADDING_VERTICAL + OUTLINED_LINE_HEIGHT_DELTA) *
          fontScale
      ),
      inactiveLabelTop: Math.ceil(
        (BASELINE_INACTIVE_LABEL_OFFSET - OUTLINED_LINE_HEIGHT_DELTA) *
          fontScale
      ),
      multilinePaddingTop: Math.ceil(
        (BASELINE_INACTIVE_LABEL_OFFSET -
          BASELINE_TEXT_INPUT_PADDING_VERTICAL -
          OUTLINED_LINE_HEIGHT_DELTA) *
          fontScale
      ),
    },
  };
};

export type TextInputMetrics = ReturnType<typeof getTextInputMetrics>;
