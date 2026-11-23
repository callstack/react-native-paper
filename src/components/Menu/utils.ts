import type { ColorValue, ViewStyle } from 'react-native';

import { MenuTokens, type MenuColorScheme } from './tokens';
import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
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
}: ColorProps): {
  titleColor: ColorValue;
  iconColor: ColorValue;
  supportingColor: ColorValue;
  containerColor: ColorValue | undefined;
  contentOpacity: number;
} => {
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
 * Per-item corner radius. Spec: corner.extra-small at rest, corner.medium when
 * selected.
 */
export const getMenuItemBorderRadius = ({
  theme,
  selected,
}: {
  theme: InternalTheme;
  selected?: boolean;
}): ViewStyle => ({
  borderRadius: resolveCornerRadius(
    theme,
    selected ? MenuTokens.shapes.itemSelected : MenuTokens.shapes.item
  ),
});

export const getMenuContainerBorderRadius = (theme: InternalTheme): number =>
  resolveCornerRadius(theme, MenuTokens.shapes.container);
