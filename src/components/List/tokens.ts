import type { ColorRole } from '../../theme/types';

const sizes = {
  verticalPadding: 12,
  oneLineContainerHeight: 56,
  twoLineContainerHeight: 72,
  leadingSpace: 16,
  trailingSpace: 16,
} as const;

const colors = {
  containerColor: 'surface',
  headlineColor: 'onSurface',
  supportingTextColor: 'onSurfaceVariant',
  leadingIconColor: 'onSurfaceVariant',
  trailingIconColor: 'onSurfaceVariant',
  expandTrailingIconColor: 'onSurface',
} as const satisfies Record<string, ColorRole>;

export const ListTokens = { ...sizes, ...colors };
