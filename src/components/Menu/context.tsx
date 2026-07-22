import * as React from 'react';

import type { MenuColorScheme } from './tokens';

/**
 * Root menu state: color scheme + focus key for shape morph.
 * Provided by `Menu`; consumed by layout helpers and items.
 */
export type MenuRootContextValue = {
  colorScheme: MenuColorScheme;
  focusedKey: string | null;
  setFocusedKey: (key: string | null) => void;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | null>(
  null
);

/**
 * Per-item layout from the parent `Menu` (or `Menu.Section` tree walk).
 * Items prefer explicit props over these defaults. No `cloneElement`.
 */
export type MenuItemLayoutContextValue = {
  colorScheme: MenuColorScheme;
  roundedTop: boolean;
  roundedBottom: boolean;
  /** Item is the current focus morph target (Expressive vertical menu). */
  morphActive: boolean;
  itemKey: string;
  setFocusedKey: (key: string | null) => void;
};

export const MenuItemLayoutContext =
  React.createContext<MenuItemLayoutContextValue | null>(null);

export function useMenuItemLayout() {
  return React.useContext(MenuItemLayoutContext);
}

export function useMenuRoot() {
  return React.useContext(MenuRootContext);
}
