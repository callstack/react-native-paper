import type { ColorValue, ViewStyle } from 'react-native';

import { MenuTokens, type MenuColorScheme } from './tokens';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { InternalTheme } from '../../types';
import type { IconSource } from '../Icon';

const stateOpacity = tokens.md.sys.state.opacity;

export const MIN_WIDTH = MenuTokens.sizes.minWidth;
export const MAX_WIDTH = MenuTokens.sizes.maxWidth;

type ContentProps = {
  iconWidth: number;
  leadingIcon?: IconSource;
  trailingIcon?: IconSource;
  hasTrailingSupportingText?: boolean;
};

type ColorProps = {
  theme: InternalTheme;
  disabled?: boolean;
  selected?: boolean;
  colorScheme?: MenuColorScheme;
};

const resolveRoles = (colorScheme: MenuColorScheme = 'standard') =>
  colorScheme === 'vibrant'
    ? MenuTokens.vibrantColors
    : MenuTokens.standardColors;

export const getMenuItemColor = ({
  theme,
  disabled,
  selected,
  colorScheme = 'standard',
}: ColorProps) => {
  const roles = resolveRoles(colorScheme);
  const contentOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;

  const useSelected = Boolean(selected) && !disabled;

  const titleColor: ColorValue = useSelected
    ? theme.colors[roles.selectedContent]
    : theme.colors[roles.label];

  const iconColor: ColorValue = useSelected
    ? theme.colors[roles.selectedContent]
    : theme.colors[roles.icon];

  const supportingColor: ColorValue = useSelected
    ? theme.colors[roles.selectedContent]
    : theme.colors[roles.supporting];

  const containerColor: ColorValue | undefined = useSelected
    ? theme.colors[roles.selectedContainer]
    : undefined;

  return {
    titleColor,
    iconColor,
    supportingColor,
    containerColor,
    contentOpacity,
  };
};

/**
 * Resolve the menu surface background.
 * Standard: MD3 `surfaceContainerLow` (not elevation.levelN — those map to
 * different surfaceContainer* tones in this theme; elevation drives shadow only).
 * Vibrant: tertiaryContainer.
 */
export const getMenuContainerColor = ({
  theme,
  colorScheme = 'standard',
}: {
  theme: InternalTheme;
  /** @deprecated Ignored for fill; elevation still sets Surface shadow. Kept for call-site compat. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  colorScheme?: MenuColorScheme;
}): ColorValue => {
  if (colorScheme === 'vibrant') {
    return theme.colors[MenuTokens.vibrantColors.container];
  }
  return theme.colors[MenuTokens.standardColors.container];
};

export const getContentMaxWidth = ({
  iconWidth,
  leadingIcon,
  trailingIcon,
  hasTrailingSupportingText,
}: ContentProps) => {
  let reserved = 12;
  if (leadingIcon) {
    reserved += iconWidth + MenuTokens.sizes.iconLabelGap;
  }
  if (trailingIcon) {
    reserved += iconWidth + 12;
  }
  if (hasTrailingSupportingText) {
    // Trailing supporting text shares trailing space; reserve a modest slot.
    reserved += 48;
  }
  return MAX_WIDTH - reserved;
};

/**
 * Target per-corner radii for first / last / selected / focus-morph items.
 * Spec: corner.medium on the relevant corners; selected or morph-active uses
 * medium on all corners.
 */
export const getMenuItemMorphRadii = ({
  theme,
  selected,
  morphActive,
  roundedTop,
  roundedBottom,
}: {
  theme: InternalTheme;
  selected?: boolean;
  morphActive?: boolean;
  roundedTop?: boolean;
  roundedBottom?: boolean;
}): {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  medium: number;
} => {
  const medium = resolveCornerRadius(theme, MenuTokens.shapes.item);
  const full = Boolean(selected) || Boolean(morphActive);

  return {
    medium,
    topLeft: full || roundedTop ? medium : 0,
    topRight: full || roundedTop ? medium : 0,
    bottomLeft: full || roundedBottom ? medium : 0,
    bottomRight: full || roundedBottom ? medium : 0,
  };
};

/**
 * Static per-item corner radii (initial / reduce-motion snapshot).
 * Spec: corner.medium on the relevant corners; selected uses medium all around.
 */
export const getMenuItemBorderRadius = ({
  theme,
  selected,
  roundedTop,
  roundedBottom,
}: {
  theme: InternalTheme;
  selected?: boolean;
  roundedTop?: boolean;
  roundedBottom?: boolean;
}): ViewStyle => {
  const { topLeft, topRight, bottomLeft, bottomRight, medium } =
    getMenuItemMorphRadii({
      theme,
      selected,
      roundedTop,
      roundedBottom,
    });

  if (selected) {
    return { borderRadius: medium };
  }

  return {
    borderTopLeftRadius: topLeft,
    borderTopRightRadius: topRight,
    borderBottomLeftRadius: bottomLeft,
    borderBottomRightRadius: bottomRight,
  };
};

export const getMenuContainerBorderRadius = (theme: InternalTheme): number =>
  resolveCornerRadius(theme, MenuTokens.shapes.container);
