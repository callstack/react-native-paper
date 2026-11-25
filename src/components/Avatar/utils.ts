import { Platform } from 'react-native';
import type { AccessibilityRole } from 'react-native';

import type { AvatarImageSource } from './AvatarImage';

export const DEFAULT_SIZE = 64;

/**
 * Whether the avatar received its own label through `accessibilityLabel` or
 * `aria-label`.
 */
export const hasCustomLabel = (props: {
  accessibilityLabel?: string;
  'aria-label'?: string;
}) =>
  props.accessibilityLabel !== undefined || props['aria-label'] !== undefined;

/**
 * Props that let a labelled avatar announce its label.
 * iOS reads a label only from an accessibility element, and merges one inside
 * a pressable parent into the parent. Android reads the label without
 * `accessible`, and `accessible` would make the avatar a second TalkBack stop
 * inside a pressable parent, so Android leaves it out.
 * `role="img"` gives the label a name on web, which ignores a label on an
 * element without a role. A custom `accessibilityRole` is kept, because `role`
 * would override it.
 */
export const getLabelledAvatarProps = (
  accessibilityRole?: AccessibilityRole
) => ({
  ...(Platform.OS !== 'android' && { accessible: true as const }),
  ...(accessibilityRole === undefined && { role: 'img' as const }),
});

/**
 * Identity for retrying a failed avatar image.
 * Function sources use `sourceKey`, or one stable key without it, so inline
 * renderers do not reset state.
 */
export const getAvatarImageSourceKey = (
  source: AvatarImageSource,
  sourceKey?: string | number
) => {
  if (typeof source === 'function') {
    return sourceKey ?? 'function';
  }

  if (
    source &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    'uri' in source
  ) {
    return source.uri;
  }

  return source;
};
