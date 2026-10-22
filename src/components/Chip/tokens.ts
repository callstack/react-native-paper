import type { ColorRole, TypescaleKey } from '../../theme/types';

/**
 * MD3 Chip component tokens.
 * @see https://m3.material.io/components/chips/specs
 */
const sizes = {
  containerHeight: 32,
  minimumTouchTarget: 48,
  outlineWidth: 1,
  iconSize: 18,
  avatarSize: 24,
  leadingPadding: 16,
  trailingPadding: 16,
  iconLeadingPadding: 8,
  avatarLeadingPadding: 4,
  trailingIconPadding: 8,
  leadingLabelGap: 8,
  labelTypescale: 'labelLarge' as TypescaleKey,

  disabledContentOpacity: 0.38,

  flatElevation: 0,
  elevatedElevation: 1,
  elevatedHoverElevation: 2,

  focusIndicatorThickness: 3,
  focusIndicatorOffset: 2,
} as const;

const colors = {
  elevatedContainerColor: 'surfaceContainerLow',
  flatContainerColor: 'surfaceContainerLow',
  selectedContainerColor: 'secondaryContainer',
  outlinedContainerColor: 'surface',
  focusIndicatorColor: 'secondary',
  labelColor: 'onSurfaceVariant',
  selectedLabelColor: 'onSecondaryContainer',
  leadingIconColor: 'primary',
  selectedIconColor: 'onSecondaryContainer',
  trailingIconColor: 'onSurfaceVariant',
  selectedTrailingIconColor: 'onSecondaryContainer',
  outlineColor: 'outlineVariant',
  focusOutlineColor: 'onSurfaceVariant',
  disabledColor: 'onSurface',
} as const satisfies Record<string, ColorRole>;

export const ChipTokens = { ...sizes, ...colors };
