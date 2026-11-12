import * as React from 'react';

import type { AppbarModes } from './utils';
import type { ThemeProp } from '../../theme/types';

export type AppbarItemKind = 'leading' | 'trailing' | 'content';

export type AppbarContextType = {
  /**
   * Mode of the surrounding Appbar.
   */
  mode: AppbarModes;
  /**
   * Whether the Appbar background is dark, so its parts render light content.
   */
  dark: boolean;
  /**
   * Safe area insets of the surrounding Appbar.
   */
  insets: { top: number; bottom: number; left: number; right: number };
  /**
   * Theme override of the surrounding Appbar.
   */
  theme?: ThemeProp;
  /**
   * Registers a part that takes part in the layout of the `center-aligned`
   * mode. Returns a function that unregisters it.
   * Only available in the `center-aligned` mode.
   */
  registerItem?: (kind: AppbarItemKind) => () => void;
  /**
   * Reports the height of the content area of a flexible Appbar, so the Appbar
   * can grow with a title that wraps onto multiple lines.
   * Only available in the flexible modes.
   */
  onContentLayout?: (height: number) => void;
};

export const AppbarContext = React.createContext<AppbarContextType | null>(
  null
);

AppbarContext.displayName = 'AppbarContext';

export const useAppbarContext = () => React.useContext(AppbarContext);

/**
 * Registers a part in the surrounding Appbar when the mode lays out its parts
 * based on how many of them there are.
 */
export const useAppbarItem = (
  appbar: AppbarContextType | null,
  kind: AppbarItemKind
) => {
  const registerItem = appbar?.registerItem;

  React.useLayoutEffect(() => registerItem?.(kind), [registerItem, kind]);
};
