import type { AppbarAction, AppbarVariant } from './types';

export const APPBAR_ACTION_SIZE = 48;
export const APPBAR_WIDE_ACTION_SIZE = 64;
export const APPBAR_TITLE_IMAGE_HEIGHT = 32;
export const APPBAR_SEARCH_MIN_WIDTH = 360;
export const APPBAR_SEARCH_MAX_WIDTH = 720;

export const getAppbarSearchWidth = (availableWidth: number) => {
  if (availableWidth < APPBAR_SEARCH_MIN_WIDTH) {
    return availableWidth;
  }

  return Math.min(availableWidth, APPBAR_SEARCH_MAX_WIDTH);
};

export const getAppbarHeight = (
  variant: AppbarVariant,
  hasSubtitle: boolean
) => {
  if (variant === 'search' || variant === 'small') {
    return 64;
  }

  if (variant === 'medium-flexible') {
    return hasSubtitle ? 136 : 112;
  }

  return hasSubtitle ? 152 : 120;
};

export const getActionsWidth = (actions: readonly AppbarAction[]) =>
  actions.reduce(
    (width, action) =>
      width +
      (action.variant !== 'standard' && action.width === 'wide'
        ? APPBAR_WIDE_ACTION_SIZE
        : APPBAR_ACTION_SIZE),
    0
  );
