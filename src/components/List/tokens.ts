import { tokens } from '../../theme/tokens';
import type { ColorRole } from '../../theme/types';

const sizes = {
  verticalPadding: 8,
  threeLineVerticalPadding: 12,
  oneLineContainerHeight: 56,
  twoLineContainerHeight: 72,
  leadingSpace: 16,
  trailingSpace: 16,
} as const;

const opacities = {
  disabledContentOpacity: tokens.md.sys.state.opacity.disabled,
  selectedDisabledContainerOpacity: tokens.md.sys.state.opacity.disabled,
} as const;

const colors = {
  containerColor: 'surface',
  headlineColor: 'onSurface',
  supportingTextColor: 'onSurfaceVariant',
  leadingIconColor: 'onSurfaceVariant',
  trailingIconColor: 'onSurfaceVariant',
  expandTrailingIconColor: 'onSurface',
  selectedContainerColor: 'secondaryContainer',
  selectedContentColor: 'onSecondaryContainer',
  disabledContentColor: 'onSurface',
  selectedDisabledContainerColor: 'onSurface',
} as const satisfies Record<string, ColorRole>;

export const ListTokens = { ...sizes, ...opacities, ...colors };
