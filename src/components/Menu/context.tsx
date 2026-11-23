import * as React from 'react';

import type { Props as MenuProps } from './Menu';
import type { MenuColorScheme } from './tokens';

/**
 * Root menu state: color scheme, and `Menu` itself so an item can render a
 * submenu without importing it (`Menu` imports `MenuItem`, so importing back
 * would be circular).
 * Provided by `Menu`; consumed by items.
 */
type MenuRootContextValue = {
  colorScheme: MenuColorScheme;
  MenuComponent: React.ComponentType<MenuProps>;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | null>(
  null
);

export function useMenuRoot() {
  return React.useContext(MenuRootContext);
}
