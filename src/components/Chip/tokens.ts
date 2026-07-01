import type { ColorRole, Elevation, TypescaleKey } from '../../theme/types';

/**
 * MD3 Chip component tokens.
 * @see https://m3.material.io/components/chips/specs
 */
export const CHIP_CONTAINER_HEIGHT = 32;
export const CHIP_MINIMUM_TOUCH_TARGET = 48;
export const CHIP_OUTLINE_WIDTH = 1;
export const CHIP_LEADING_ICON_SIZE = 18;
export const CHIP_TRAILING_ICON_SIZE = 18;
export const CHIP_AVATAR_SIZE = 24;
export const CHIP_SELECTED_ICON_SIZE = 18;
export const CHIP_LEADING_PADDING = 16;
export const CHIP_TRAILING_PADDING = 16;
export const CHIP_ICON_LEADING_PADDING = 8;
export const CHIP_AVATAR_LEADING_PADDING = 4;
export const CHIP_CLOSE_TRAILING_PADDING = 8;
export const CHIP_LEADING_LABEL_GAP = 8;
export const CHIP_TRAILING_ICON_TOUCH_TARGET = 32;
export const CHIP_LABEL_TYPESCALE: TypescaleKey = 'labelLarge';

export const CHIP_ELEVATED_CONTAINER_COLOR: ColorRole = 'surfaceContainerLow';
export const CHIP_FLAT_CONTAINER_COLOR: ColorRole = 'surfaceContainerLow';
export const CHIP_SELECTED_CONTAINER_COLOR: ColorRole = 'secondaryContainer';
export const CHIP_OUTLINED_CONTAINER_COLOR: ColorRole = 'surface';
export const CHIP_LABEL_COLOR: ColorRole = 'onSurfaceVariant';
export const CHIP_SELECTED_LABEL_COLOR: ColorRole = 'onSecondaryContainer';
export const CHIP_LEADING_ICON_COLOR: ColorRole = 'primary';
export const CHIP_SELECTED_ICON_COLOR: ColorRole = 'onSecondaryContainer';
export const CHIP_TRAILING_ICON_COLOR: ColorRole = 'onSurfaceVariant';
export const CHIP_SELECTED_TRAILING_ICON_COLOR: ColorRole =
  'onSecondaryContainer';
export const CHIP_OUTLINE_COLOR: ColorRole = 'outline';
export const CHIP_DISABLED_COLOR: ColorRole = 'onSurface';

export const CHIP_DISABLED_CONTENT_OPACITY = 0.38;

export const CHIP_FLAT_ELEVATION: Elevation = 0;
export const CHIP_ELEVATED_ELEVATION: Elevation = 1;
