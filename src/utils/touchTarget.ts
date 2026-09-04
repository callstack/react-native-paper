import type { Insets } from 'react-native';

/**
 * Minimum touch target size (in dp) required by the Material Design
 * accessibility guidelines. Controls whose visual size is smaller — such as
 * the 40dp state layer of `Checkbox` and `RadioButton` — still have to expose
 * a target at least this large.
 *
 * @see https://m3.material.io/foundations/designing/structure
 */
export const MIN_TOUCH_TARGET_SIZE = 48;

/**
 * Symmetric `hitSlop` that grows a `size` x `size` control up to
 * `MIN_TOUCH_TARGET_SIZE` without changing its visual bounds. Returns
 * `undefined` when the control already meets the minimum, so no redundant
 * prop reaches the underlying pressable.
 *
 * Note that on Android a child's `hitSlop` cannot extend past its parent's
 * bounds, so a control placed in a tightly clipped container may still
 * receive a smaller effective target.
 */
export const getMinTouchTargetHitSlop = (size: number): Insets | undefined => {
  const inset = (MIN_TOUCH_TARGET_SIZE - size) / 2;

  if (inset <= 0) {
    return undefined;
  }

  return { top: inset, bottom: inset, left: inset, right: inset };
};
