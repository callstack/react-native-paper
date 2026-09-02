import type { ColorRole, Elevation, TypescaleKey } from '../../theme/types';
import type { ShapeToken } from '../../theme/utils/shape';

export type SplitButtonMode = 'filled' | 'tonal' | 'elevated' | 'outlined';

export type SplitButtonSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';

export type SplitButtonSizeTokens = {
  betweenSpace: number;
  containerHeight: number;
  containerShape: ShapeToken;
  innerCornerShape: ShapeToken;
  leadingButtonLeadingSpace: number;
  leadingButtonTrailingSpace: number;
  leadingIconSize: number;
  iconLabelGap: number;
  trailingButtonLeadingSpace: number;
  trailingButtonTrailingSpace: number;
  trailingIconSize: number;
  labelVariant: TypescaleKey;
};

export const splitButtonSizeTokens: Record<
  SplitButtonSize,
  SplitButtonSizeTokens
> = {
  'extra-small': {
    betweenSpace: 2,
    containerHeight: 32,
    containerShape: 'full',
    innerCornerShape: 'extraSmall',
    leadingButtonLeadingSpace: 12,
    leadingButtonTrailingSpace: 10,
    leadingIconSize: 20,
    iconLabelGap: 8,
    trailingButtonLeadingSpace: 13,
    trailingButtonTrailingSpace: 13,
    trailingIconSize: 22,
    labelVariant: 'labelLarge',
  },
  small: {
    betweenSpace: 2,
    containerHeight: 40,
    containerShape: 'full',
    innerCornerShape: 'extraSmall',
    leadingButtonLeadingSpace: 16,
    leadingButtonTrailingSpace: 12,
    leadingIconSize: 20,
    iconLabelGap: 8,
    trailingButtonLeadingSpace: 13,
    trailingButtonTrailingSpace: 13,
    trailingIconSize: 22,
    labelVariant: 'labelLarge',
  },
  medium: {
    betweenSpace: 2,
    containerHeight: 56,
    containerShape: 'full',
    innerCornerShape: 'extraSmall',
    leadingButtonLeadingSpace: 24,
    leadingButtonTrailingSpace: 24,
    leadingIconSize: 24,
    iconLabelGap: 8,
    trailingButtonLeadingSpace: 15,
    trailingButtonTrailingSpace: 15,
    trailingIconSize: 26,
    labelVariant: 'titleMedium',
  },
  large: {
    betweenSpace: 2,
    containerHeight: 96,
    containerShape: 'full',
    innerCornerShape: 'small',
    leadingButtonLeadingSpace: 48,
    leadingButtonTrailingSpace: 48,
    leadingIconSize: 32,
    iconLabelGap: 12,
    trailingButtonLeadingSpace: 29,
    trailingButtonTrailingSpace: 29,
    trailingIconSize: 38,
    labelVariant: 'headlineSmall',
  },
  'extra-large': {
    betweenSpace: 2,
    containerHeight: 136,
    containerShape: 'full',
    innerCornerShape: 'medium',
    leadingButtonLeadingSpace: 64,
    leadingButtonTrailingSpace: 64,
    leadingIconSize: 40,
    iconLabelGap: 16,
    trailingButtonLeadingSpace: 43,
    trailingButtonTrailingSpace: 43,
    trailingIconSize: 50,
    labelVariant: 'headlineLarge',
  },
};

export const splitButtonMinInteractiveSize = 48;

export const splitButtonStateLayerOpacity = 0.1;

export type SplitButtonColorTokens = {
  containerColor?: ColorRole;
  containerOpacity: number;
  contentColor: ColorRole;
  contentOpacity: number;
  borderColor?: ColorRole;
  elevation: Elevation;
};

export const splitButtonColorTokens: Record<
  SplitButtonMode,
  { enabled: SplitButtonColorTokens; disabled: SplitButtonColorTokens }
> = {
  elevated: {
    enabled: {
      containerColor: 'surfaceContainerLow',
      containerOpacity: 1,
      contentColor: 'primary',
      contentOpacity: 1,
      elevation: 1,
    },
    disabled: {
      containerColor: 'onSurface',
      containerOpacity: 0.1,
      contentColor: 'onSurface',
      contentOpacity: 0.38,
      elevation: 0,
    },
  },
  filled: {
    enabled: {
      containerColor: 'primary',
      containerOpacity: 1,
      contentColor: 'onPrimary',
      contentOpacity: 1,
      elevation: 0,
    },
    disabled: {
      containerColor: 'onSurface',
      containerOpacity: 0.1,
      contentColor: 'onSurface',
      contentOpacity: 0.38,
      elevation: 0,
    },
  },
  tonal: {
    enabled: {
      containerColor: 'secondaryContainer',
      containerOpacity: 1,
      contentColor: 'onSecondaryContainer',
      contentOpacity: 1,
      elevation: 0,
    },
    disabled: {
      containerColor: 'onSurface',
      containerOpacity: 0.1,
      contentColor: 'onSurface',
      contentOpacity: 0.38,
      elevation: 0,
    },
  },
  outlined: {
    enabled: {
      containerOpacity: 1,
      contentColor: 'onSurfaceVariant',
      contentOpacity: 1,
      borderColor: 'outlineVariant',
      elevation: 0,
    },
    disabled: {
      containerOpacity: 1,
      contentColor: 'outlineVariant',
      contentOpacity: 0.38,
      borderColor: 'outlineVariant',
      elevation: 0,
    },
  },
};
