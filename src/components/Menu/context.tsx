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

export function useMenuRoot() {
  return React.useContext(MenuRootContext);
}

/**
 * Where an item sits in the menu, so first / last can round their outer
 * corners. `Menu` derives it from child order; no props reach the children.
 */
export type MenuItemPositionContextValue = {
  roundedTop: boolean;
  roundedBottom: boolean;
};

export const MenuItemPositionContext =
  React.createContext<MenuItemPositionContextValue | null>(null);

export function useMenuItemPosition() {
  return React.useContext(MenuItemPositionContext);
}
