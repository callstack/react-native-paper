import * as React from 'react';
import type {
  ColorValue,
  NativeSyntheticEvent,
  TargetedEvent,
  ViewStyle,
} from 'react-native';

import { isKeyboardFocusEvent } from './isKeyboardFocusEvent';
import { tokens } from '../theme/tokens';

const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

export type FocusRingPlacement = 'outward' | 'inward' | 'none';

export type FocusRingState = {
  focused: boolean;
  onFocus: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur: () => void;
};

/**
 * Tracks keyboard focus for an MD3 focus indicator.
 *
 * Fires on web and Android only. iOS never dispatches `onFocus` for a View or
 * Pressable unless the `enableImperativeFocus` flag is on, and it defaults off.
 */
export function useFocusRing(disabled?: boolean): FocusRingState {
  const [focused, setFocused] = React.useState(false);

  const onFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      // Symmetric, and skipped entirely when there is nothing to show, so a
      // suppressed ring costs no render.
      if (!disabled) {
        setFocused(isKeyboardFocusEvent(e));
      }
    },
    [disabled]
  );

  const onBlur = React.useCallback(() => setFocused(false), []);

  // The focusable node can unmount while this hook stays mounted, and neither
  // the DOM nor React fires blur for that, so clear rather than only masking.
  React.useEffect(() => {
    if (disabled) {
      setFocused(false);
    }
  }, [disabled]);

  return { focused: focused && !disabled, onFocus, onBlur };
}

/**
 * MD3 focus indicator, drawn with the platform's own `outline`. Costs no
 * layout, takes its radius from the view it sits on, and `borderless` does not
 * clip it.
 *
 * Outward by default, per MD3 (hence the `outerOffset` token): the ring lands
 * on the page background, where it has a predictable contrast ratio. Pass
 * `inward` only where an outward ring is measurably clipped or would land on a
 * neighbour - list rows, flush segments, chips in a scrolling row.
 *
 * Never pair this with `outline: 'none'`. Ours overrides the browser's, so if
 * it never runs the user still gets the browser ring instead of nothing.
 */
export const getFocusRingStyle = (
  focused: boolean,
  color: ColorValue,
  placement: FocusRingPlacement = 'outward'
): ViewStyle | null =>
  focused && placement !== 'none'
    ? {
        outlineWidth: thickness,
        outlineColor: color,
        outlineStyle: 'solid',
        outlineOffset: placement === 'inward' ? -thickness : outerOffset,
      }
    : null;

/** Spread into a style array so an absent ring adds no entry. */
export const toStyleList = (s: ViewStyle | null): ViewStyle[] => (s ? [s] : []);

/**
 * Suppresses the browser's own focus ring. Only for controls that draw the MD3
 * ring on a different element, where the browser's would land on the wrong box
 * or be clipped. Anywhere else, leaving it alone is the safer default.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const webNoOutline = { outline: 'none' } as unknown as ViewStyle;
