import * as React from 'react';
import {
  Platform,
  type ColorValue,
  type NativeSyntheticEvent,
  type TargetedEvent,
  type ViewStyle,
} from 'react-native';

import { isKeyboardFocusEvent } from './isKeyboardFocusEvent';
import { tokens } from '../theme/tokens';

const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

export type FocusRingPlacement = 'outward' | 'inward' | 'none';

/**
 * `'self'` - the ring is drawn on the element that receives focus.
 * `'within'` - the ring is drawn on an ancestor (a track/clip view), because
 * the focusable element's own box is the wrong shape or size for it.
 */
export type FocusRingScope = 'self' | 'within';

export type FocusRingResult = {
  /** Spread onto the element that receives focus. */
  target: {
    onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
    onBlur?: () => void;
    style: ViewStyle[];
  };
  /** Spread onto the element that draws the ring. */
  ring: {
    style: ViewStyle[];
    /**
     * Spread onto the ring element, e.g. `<View {...ring.dataSetProps}>`.
     * `dataSet` isn't in RN's core view prop types, though react-native-web
     * renders it as real `data-*` attributes - the mechanism the shared
     * stylesheet below keys off. Typed as `object` so it spreads onto any
     * host component without a prop-type mismatch; empty (a no-op spread)
     * on native and when the ring is suppressed.
     */
    dataSetProps: object;
  };
};

const toDataSetProps = (dataSet: Record<string, string> | undefined): object =>
  dataSet ? { dataSet } : {};

const EMPTY: FocusRingResult = {
  target: { style: [] },
  ring: { style: [], dataSetProps: {} },
};

/** Suppresses the browser's own focus ring, for `scope: 'within'` on web. */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutlineStyle = { outline: 'none' } as unknown as ViewStyle;

/**
 * MD3 keyboard focus indicator, from one hook shared by every component built
 * on it.
 *
 * On native there is no CSS, so this tracks focus in state and computes the
 * ring as an `outline*` style, live. On web the ring is real CSS: a shared
 * stylesheet keyed off a `data-focus-ring[-within]` attribute and
 * `:focus-visible`/`:has(:focus-visible)`, with only the (theme-dependent)
 * color passed through as a CSS custom property. Nothing here tracks focus in
 * JS on web - the browser drives it.
 *
 * `scope: 'within'` is for a control whose ring belongs on an ancestor of the
 * element that actually receives focus (Switch's track, FAB's clip view):
 * `target` also suppresses the browser's default outline on the focused
 * element itself on web, so only the ring shows.
 *
 * iOS: `onFocus`/`onBlur` never reach here today. Fabric's view does call
 * `-becomeFirstResponder`/`-resignFirstResponder` for hardware-keyboard/Full
 * Keyboard Access navigation, but only emits the JS event when the
 * `enableImperativeFocus` feature flag is on, and it defaults off (old
 * architecture has no equivalent path at all). Pre-existing, not something
 * this hook introduces - the library's older FAB, Checkbox, and Switch rings
 * were equally inert on iOS.
 */
export function useFocusRing(
  disabled: boolean | undefined,
  color: ColorValue,
  placement: FocusRingPlacement = 'outward',
  scope: FocusRingScope = 'self'
): FocusRingResult {
  const suppressed = disabled || placement === 'none';

  // Rules of hooks: called unconditionally regardless of platform. Cheap -
  // native's is a no-op until focus/blur actually fires, web's is stateless.
  const [focused, setFocused] = React.useState(false);

  const onFocus = React.useCallback(
    (e: NativeSyntheticEvent<TargetedEvent>) => {
      if (!suppressed) {
        setFocused(isKeyboardFocusEvent(e));
      }
    },
    [suppressed]
  );

  const onBlur = React.useCallback(() => setFocused(false), []);

  // The focusable node can unmount while this hook stays mounted, and neither
  // the DOM nor React fires blur for that, so clear rather than only masking.
  React.useEffect(() => {
    if (suppressed) {
      setFocused(false);
    }
  }, [suppressed]);

  const isNativeFocused = focused && !suppressed;

  return React.useMemo(() => {
    if (suppressed) {
      return EMPTY;
    }

    if (Platform.OS === 'web') {
      const dataKey = scope === 'within' ? 'focusRingWithin' : 'focusRing';
      return {
        target: { style: scope === 'within' ? [webNoOutlineStyle] : [] },
        ring: {
          style: [
            // A style key starting with `--` becomes a real CSS custom
            // property on web (react-native-web's setValueForStyles), read
            // by the shared stylesheet below. Not reactive to focus - the
            // browser's own `:focus-visible`/`:has()` shows the ring.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            { ['--rnp-focus-ring-color']: color } as unknown as ViewStyle,
          ],
          dataSetProps: toDataSetProps({ [dataKey]: placement }),
        },
      };
    }

    return {
      target: { onFocus, onBlur, style: [] },
      ring: {
        style: isNativeFocused
          ? [
              {
                outlineWidth: thickness,
                outlineColor: color,
                outlineStyle: 'solid' as const,
                outlineOffset:
                  placement === 'inward' ? -thickness : outerOffset,
              },
            ]
          : [],
        dataSetProps: {},
      },
    };
  }, [suppressed, scope, color, placement, isNativeFocused, onFocus, onBlur]);
}

const STYLE_ELEMENT_ATTR = 'data-rnp-focus-ring-styles';

const focusRingRule = (
  selector: (placement: 'outward' | 'inward') => string
) => `
${selector('outward')} {
  outline: ${thickness}px solid var(--rnp-focus-ring-color);
  outline-offset: ${outerOffset}px;
}
${selector('inward')} {
  outline: ${thickness}px solid var(--rnp-focus-ring-color);
  outline-offset: ${-thickness}px;
}`;

/**
 * The shared web stylesheet text, as a pure function of the design tokens -
 * exported so its contents can be asserted without a DOM.
 */
export const buildFocusRingStylesheet = (): string =>
  [
    focusRingRule((p) => `[data-focus-ring="${p}"]:focus-visible`),
    focusRingRule((p) => `[data-focus-ring-within="${p}"]:has(:focus-visible)`),
  ].join('\n');

let injected = false;

/** Idempotent: safe to call from every module that needs the ring on web. */
export const injectFocusRingStylesheet = (): void => {
  if (injected || Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }
  if (document.querySelector(`style[${STYLE_ELEMENT_ATTR}]`)) {
    injected = true;
    return;
  }

  const style = document.createElement('style');
  style.setAttribute(STYLE_ELEMENT_ATTR, '');
  style.textContent = buildFocusRingStylesheet();
  document.head.appendChild(style);
  injected = true;
};

if (Platform.OS === 'web') {
  injectFocusRingStylesheet();
}
