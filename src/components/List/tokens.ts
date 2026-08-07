import type { ColorRole } from '../../theme/types';

const sizes = {
  oneLineVerticalPadding: 16,
  twoLineVerticalPadding: 14,
  leadingSpace: 16,
  trailingSpace: 24,
} as const;

const colors = {
  containerColor: 'surface',
  headlineColor: 'onSurface',
  supportingTextColor: 'onSurfaceVariant',
  leadingIconColor: 'onSurfaceVariant',
  trailingIconColor: 'onSurfaceVariant',
} as const satisfies Record<string, ColorRole>;

export const ListTokens = { ...sizes, ...colors };
