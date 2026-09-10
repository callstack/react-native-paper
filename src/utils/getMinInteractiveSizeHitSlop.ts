import type { Insets } from 'react-native';

/**
 * Minimum size of an interactive target.
 * @see https://m3.material.io/foundations/designing/structure
 */
const MIN_INTERACTIVE_SIZE = 48;

/**
 * Slop needed to bring a fixed-size element up to the 48dp minimum
 * interactive target, expanding outward rather than resizing. Pass the
 * element's own rendered width and/or height; omit an axis that is already
 * big enough on its own (e.g. a pill that grows with its label) to opt it out
 * of slop entirely. Returns `undefined` when there is nothing to add, so that
 * case does not create a new object on every call.
 * @see https://developer.android.com/develop/ui/compose/accessibility/api-defaults
 */
const getMinInteractiveSizeHitSlop = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}): Insets | undefined => {
  const horizontal =
    width === undefined ? 0 : Math.max(0, (MIN_INTERACTIVE_SIZE - width) / 2);
  const vertical =
    height === undefined ? 0 : Math.max(0, (MIN_INTERACTIVE_SIZE - height) / 2);

  if (horizontal === 0 && vertical === 0) {
    return undefined;
  }

  return {
    top: vertical,
    bottom: vertical,
    left: horizontal,
    right: horizontal,
  };
};

export default getMinInteractiveSizeHitSlop;
