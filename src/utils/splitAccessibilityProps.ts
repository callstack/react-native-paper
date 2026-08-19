import type { AccessibilityProps } from 'react-native';

/**
 * Accessibility props that are present on the `AccessibilityProps` interface.
 */
const ACCESSIBILITY_PROP_PRESENCE = {
  accessible: true,
  accessibilityActions: true,
  accessibilityLabel: true,
  'aria-label': true,
  accessibilityRole: true,
  accessibilityState: true,
  'aria-busy': true,
  'aria-checked': true,
  'aria-disabled': true,
  'aria-expanded': true,
  'aria-selected': true,
  accessibilityHint: true,
  accessibilityValue: true,
  'aria-valuemax': true,
  'aria-valuemin': true,
  'aria-valuenow': true,
  'aria-valuetext': true,
  onAccessibilityAction: true,
  importantForAccessibility: true,
  'aria-hidden': true,
  'aria-modal': true,
  role: true,
  accessibilityLabelledBy: true,
  'aria-labelledby': true,
  accessibilityLiveRegion: true,
  'aria-live': true,
  screenReaderFocusable: true,
  accessibilityElementsHidden: true,
  accessibilityViewIsModal: true,
  onAccessibilityEscape: true,
  onAccessibilityTap: true,
  onMagicTap: true,
  accessibilityIgnoresInvertColors: true,
  accessibilityLanguage: true,
  accessibilityShowsLargeContentViewer: true,
  accessibilityLargeContentTitle: true,
  accessibilityRespondsToUserInteraction: true,
} satisfies Record<keyof AccessibilityProps, true>;

/**
 * Keys of the `AccessibilityProps` interface.
 */
const ACCESSIBILITY_PROP_KEYS = Object.keys(
  ACCESSIBILITY_PROP_PRESENCE
) as (keyof AccessibilityProps)[];

/**
 * Splits the accessibility props from the rest of the props.
 * @param props - The props to split.
 * @returns The accessibility props and the rest of the props.
 */
export function splitAccessibilityProps<T extends AccessibilityProps>(
  props: T
) {
  const accessibilityProps: AccessibilityProps = {};
  const rest = { ...props };

  for (const key of ACCESSIBILITY_PROP_KEYS) {
    if (!Object.hasOwn(rest, key)) {
      continue;
    }

    const value = rest[key];
    if (value !== undefined) {
      (accessibilityProps as Record<keyof AccessibilityProps, unknown>)[key] =
        value;
    }

    delete rest[key];
  }

  return {
    accessibilityProps,
    rest: rest as Omit<T, keyof AccessibilityProps>,
  };
}
