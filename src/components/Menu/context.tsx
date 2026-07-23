import * as React from 'react';

import type { MenuColorScheme } from './tokens';

/**
 * Root menu state: color scheme.
 * Provided by `Menu`; consumed by layout helpers and items.
 */
export type MenuRootContextValue = {
  colorScheme: MenuColorScheme;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | null>(
  null
);

/**
 * Per-item layout from the parent `Menu`.
 * Items prefer explicit props over these defaults. No `cloneElement`.
 */
export type MenuItemLayoutContextValue = {
  colorScheme: MenuColorScheme;
  roundedTop: boolean;
  roundedBottom: boolean;
};

export const MenuItemLayoutContext =
  React.createContext<MenuItemLayoutContextValue | null>(null);

export function useMenuItemLayout() {
  return React.useContext(MenuItemLayoutContext);
}

export function useMenuRoot() {
  return React.useContext(MenuRootContext);
}
