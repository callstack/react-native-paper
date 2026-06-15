import type { ThemeShapeCorners, TypescaleKey } from '../../theme/types';

export type SplitButtonSize =
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large';

export type SplitButtonShapeKey = keyof ThemeShapeCorners | 'full';

export type SplitButtonSizeTokens = {
  betweenSpace: number;
  containerHeight: number;
  containerShape: SplitButtonShapeKey;
  innerCornerShape: SplitButtonShapeKey;
  innerPressedCornerShape: SplitButtonShapeKey;
  leadingButtonLeadingSpace: number;
  leadingButtonTrailingSpace: number;
  leadingIconSize: number;
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
    innerPressedCornerShape: 'small',
    leadingButtonLeadingSpace: 12,
    leadingButtonTrailingSpace: 10,
    leadingIconSize: 20,
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
    innerPressedCornerShape: 'medium',
    leadingButtonLeadingSpace: 16,
    leadingButtonTrailingSpace: 12,
    leadingIconSize: 20,
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
    innerPressedCornerShape: 'medium',
    leadingButtonLeadingSpace: 24,
    leadingButtonTrailingSpace: 24,
    leadingIconSize: 24,
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
    innerPressedCornerShape: 'largeIncreased',
    leadingButtonLeadingSpace: 48,
    leadingButtonTrailingSpace: 48,
    leadingIconSize: 32,
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
    innerPressedCornerShape: 'largeIncreased',
    leadingButtonLeadingSpace: 64,
    leadingButtonTrailingSpace: 64,
    leadingIconSize: 40,
    trailingButtonLeadingSpace: 43,
    trailingButtonTrailingSpace: 43,
    trailingIconSize: 50,
    labelVariant: 'headlineLarge',
  },
};

export const splitButtonMinInteractiveSize = 48;

export const splitButtonElevation = {
  enabled: 1,
  pressed: 2,
} as const;
