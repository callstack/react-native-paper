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
 * `'within'` - the ring is drawn on the parent of the element that receives
 * focus (a clip view, a card's box), because the focusable element's own box
 * is the wrong shape or size for it. The focusable element must be a direct
 * child: on web, a focused element deeper inside (a Button in a Card) doesn't
 * light the parent's ring.
 * `'descendant'` - the ring is drawn on a child of the element that receives
 * focus (Switch's track inside its 48dp-tall Pressable, the circle around
 * Chip's close glyph inside its close column), for the same reason.
 */
export type FocusRingScope = 'self' | 'within' | 'descendant';

export type FocusRingResult = {
  /** Spread onto the element that receives focus. */
  target: {
    onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
    onBlur?: () => void;
    style: ViewStyle[];
    /**
     * Spread onto the focused element, like `ring.dataSetProps`. Only set
     * for `scope: 'descendant'` on web, where the stylesheet needs to find
     * the focused ancestor of the ring; empty otherwise.
     */
    dataSetProps: object;
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

const readDataSet = (props: object): object | undefined =>
  'dataSet' in props && props.dataSet && typeof props.dataSet === 'object'
    ? props.dataSet
    : undefined;

/**
 * `dataSetProps` merged with a caller's own `dataSet`, for a component that
 * spreads the caller's props onto the same element as the ring. Spreading
 * `dataSetProps` after them would replace the caller's `dataSet` (e.g. their
 * test hooks); this keeps both. Empty when there is no ring attribute, so the
 * caller's `dataSet` passes through their own spread untouched.
 */
export const mergeDataSetProps = (
  callerProps: object,
  dataSetProps: object
): object => {
  const ringDataSet = readDataSet(dataSetProps);
  return ringDataSet
    ? { dataSet: { ...readDataSet(callerProps), ...ringDataSet } }
    : {};
};

/**
 * Replaces the ring color of every control inside it, for a component that
 * puts controls on a surface where `secondary` doesn't stand out: Snackbar's
 * action and close button sit on `inverseSurface`. Internal, not exported
 * from the package.
 */
export const FocusRingColorContext: React.Context<ColorValue | undefined> =
  React.createContext<ColorValue | undefined>(undefined);

const EMPTY: FocusRingResult = {
  target: { style: [], dataSetProps: {} },
  ring: { style: [], dataSetProps: {} },
};

/**
 * Suppresses the browser's own focus ring, for `scope: 'descendant'` on web.
 * `scope: 'within'` leaves that to the stylesheet below instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutlineStyle = { outline: 'none' } as unknown as ViewStyle;

/**
 * MD3 keyboard focus indicator, from one hook shared by every component built
 * on it.
 *
 * On native there is no CSS, so this tracks focus in state and computes the
 * ring as an `outline*` style, live. On web the ring is real CSS: a shared
 * stylesheet keyed off a `data-focus-ring[-within]` attribute and
 * `:focus-visible`/`:has(> :focus-visible)`, with only the (theme-dependent)
 * color passed through as a CSS custom property. Nothing here tracks focus in
 * JS on web - the browser drives it.
 *
 * `scope: 'within'` is for a control whose ring belongs on the parent of the
 * element that actually receives focus (FAB's clip view), and
 * `scope: 'descendant'` for one whose ring belongs on a child of it (Switch's
 * track). On web only the ring shows, not the browser's default outline on
 * the focused element too. For `'descendant'`, `target` hides that outline.
 * For `'within'`, the stylesheet hides it, and only in a browser that
 * supports `:has()`: one that doesn't can't draw the ring, so it shows its
 * own focus outline instead.
 *
 * iOS: a ringed element never gets its own `onFocus`/`onBlur` today. Fabric's
 * view does call `-becomeFirstResponder`/`-resignFirstResponder` for
 * hardware-keyboard/Full Keyboard Access navigation, but only emits the JS
 * event when the `enableImperativeFocus` feature flag is on, and it defaults
 * off. Pre-existing, not something this hook introduces: the library's older
 * FAB, Checkbox, and Switch rings were equally inert on iOS.
 *
 * Native focus events bubble, on iOS too (a TextInput's focus after a tap
 * reaches every ancestor's `onFocus`). The native `onFocus` ignores any event
 * whose target isn't the element it is attached to, so a focused descendant
 * never lights an ancestor's ring.
 */
export function useFocusRing(
  disabled: boolean | undefined,
  color: ColorValue,
  placement: FocusRingPlacement = 'outward',
  scope: FocusRingScope = 'self'
): FocusRingResult {
  const suppressed = disabled || placement === 'none';
  const ringColor = React.useContext(FocusRingColorContext) ?? color;

  // Rules of hooks: called unconditionally regardless of platform. Cheap -
  // native's is a no-op until focus/blur actually fires, web's is stateless.
  const [focused, setFocused] = React.useState(false);

  const onFocus = React.useCallback(
    // Optional: an app test can call the handler with no event at all
    // (`fireEvent(element, 'focus')`), and that has to keep working.
    (e?: NativeSyntheticEvent<TargetedEvent>) => {
      // Native focus events bubble: a focused descendant (a Switch in a
      // List.Item, a TextInput tapped inside a pressable Card) reaches this
      // handler too. Only the element's own focus draws its ring.
      if (suppressed || (e && e.target !== e.currentTarget)) {
        return;
      }
      setFocused(!e || isKeyboardFocusEvent(e));
    },
    [suppressed]
  );

  const onBlur = React.useCallback(() => setFocused(false), []);

  // A focused node that unmounts sends no blur, so `focused` would outlive it.
  // This clears it whenever the ring is suppressed, rather than only masking
  // it, so a caller whose focusable node can unmount keys `disabled` off that
  // too (no handler, no `onClose`) and the state resets with it.
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
      const dataKey =
        scope === 'within'
          ? 'focusRingWithin'
          : scope === 'descendant'
            ? 'focusRingDescendant'
            : 'focusRing';
      return {
        target: {
          style: scope === 'descendant' ? [webNoOutlineStyle] : [],
          dataSetProps: toDataSetProps(
            scope === 'descendant' ? { focusRingTarget: 'true' } : undefined
          ),
        },
        ring: {
          style: [
            // A style key starting with `--` becomes a real CSS custom
            // property on web (react-native-web's setValueForStyles), read
            // by the shared stylesheet below. Not reactive to focus - the
            // browser's own `:focus-visible`/`:has()` shows the ring.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            { ['--rnp-focus-ring-color']: ringColor } as unknown as ViewStyle,
          ],
          dataSetProps: toDataSetProps({ [dataKey]: placement }),
        },
      };
    }

    return {
      target: { onFocus, onBlur, style: [], dataSetProps: {} },
      ring: {
        style: isNativeFocused
          ? [
              {
                outlineWidth: thickness,
                outlineColor: ringColor,
                outlineStyle: 'solid' as const,
                outlineOffset:
                  placement === 'inward' ? -thickness : outerOffset,
              },
            ]
          : [],
        dataSetProps: {},
      },
    };
  }, [
    suppressed,
    scope,
    ringColor,
    placement,
    isNativeFocused,
    onFocus,
    onBlur,
  ]);
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
    // A direct child only: a focused element nested deeper, such as a Button
    // or a TextInput inside a Card, must not light the Card's ring too.
    focusRingRule(
      (p) => `[data-focus-ring-within="${p}"]:has(> :focus-visible)`
    ),
    // The `within` ring replaces the browser's own outline on the focused
    // child, but only where the rule above works. A browser without `:has()`
    // drops that rule, skips the block, and keeps its own outline, so the
    // control still shows focus. `:focus` and `!important` match the inline
    // `outline: 'none'` this replaces, which also beat an app's own outline
    // rules in every state.
    //
    // The ring view often clips (FAB's clip view, a FAB.Menu item's pill),
    // so the outline a browser without `:has()` draws goes inside the edge.
    `@supports selector(:has(> :focus-visible)) {
  [data-focus-ring-within] > :focus {
    outline: none !important;
  }
}
[data-focus-ring-within] > :focus {
  outline-offset: ${-thickness}px;
}`,
    focusRingRule(
      (p) =>
        `[data-focus-ring-target]:focus-visible [data-focus-ring-descendant="${p}"]`
    ),
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
