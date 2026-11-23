import { Platform } from 'react-native';
import type { AccessibilityRole } from 'react-native';

import type { AvatarImageSource } from './AvatarImage';

export const DEFAULT_SIZE = 64;

/**
 * `role="img"` for a labelled avatar, because web does not expose a name on
 * an element without a role. `role` wins over `accessibilityRole`, so a
 * custom `accessibilityRole` is kept.
 */
export const getAvatarRole = (accessibilityRole?: AccessibilityRole) =>
  accessibilityRole === undefined ? { role: 'img' as const } : {};

/**
 * Props that let a labelled avatar announce its label.
 * iOS reads a label only from an accessibility element, and merges one inside
 * a pressable parent into the parent. Android reads the label without
 * `accessible`, and `accessible` would make the avatar a second TalkBack stop
 * inside a pressable parent, so Android leaves it out.
 */
export const getLabelledAvatarProps = (
  accessibilityRole?: AccessibilityRole
) => ({
  ...(Platform.OS !== 'android' && { accessible: true as const }),
  ...getAvatarRole(accessibilityRole),
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
