import * as React from 'react';
import type { LayoutRectangle } from 'react-native';

import type { AppbarModes } from './utils';
import type { ThemeProp } from '../../theme/types';

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
   * Reports the layout of `Appbar.Content`, or `null` when it unmounts. The
   * flexible modes use its height to grow with a title that wraps onto
   * multiple lines, and the `center-aligned` mode uses its position to center
   * the title.
   * Only available in these modes.
   */
  onContentLayout?: (layout: LayoutRectangle | null) => void;
  /**
   * Margins that center `Appbar.Content` between the actions around it, by
   * making up for the side with less width.
   * Only available in the `center-aligned` mode.
   */
  contentMargins?: { left: number; right: number };
};

export const AppbarContext = React.createContext<AppbarContextType | null>(
  null
);

AppbarContext.displayName = 'AppbarContext';

export const useAppbarContext = () => React.useContext(AppbarContext);
