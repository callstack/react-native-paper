import * as React from 'react';

import type { AppbarModes } from './utils';

export type AppbarContextType = {
  /**
   * Whether the Appbar background is dark, so children can derive a
   * contrasting default foreground color without it being injected.
   */
  isDark: boolean;
  /**
   * The Appbar mode, consumed by `Appbar.Content` to pick the title text
   * variant and container layout.
   */
  mode: AppbarModes;
};

/**
 * Shared Appbar values provided to `Appbar.Action`, `Appbar.BackAction` and
 * `Appbar.Content` via context instead of being injected with `cloneElement`.
 * This keeps composition intact: children can be wrapped, reordered or
 * conditionally rendered without losing the values they need.
 */
export const AppbarContext = React.createContext<AppbarContextType | null>(
  null
);

export const useAppbarContext = () => React.useContext(AppbarContext);
