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
 * Standard: elevation[levelN] (default level2 → surfaceContainerLow).
 * Vibrant: tertiaryContainer.
 */
export const getMenuContainerColor = ({
  theme,
  elevation,
  colorScheme = 'standard',
}: {
  theme: InternalTheme;
  elevation: 0 | 1 | 2 | 3 | 4 | 5;
  colorScheme?: MenuColorScheme;
}): ColorValue => {
  if (colorScheme === 'vibrant') {
    return theme.colors[MenuTokens.vibrantColors.container];
  }
  return theme.colors.elevation[`level${elevation}`];
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
 * Per-item corner radii for first / last / selected / single items.
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
  const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);

  if (selected) {
    return { borderRadius: radius };
  }

  return {
    borderTopLeftRadius: roundedTop ? radius : 0,
    borderTopRightRadius: roundedTop ? radius : 0,
    borderBottomLeftRadius: roundedBottom ? radius : 0,
    borderBottomRightRadius: roundedBottom ? radius : 0,
  };
};

export const getMenuContainerBorderRadius = (theme: InternalTheme): number =>
  resolveCornerRadius(theme, MenuTokens.shapes.container);
