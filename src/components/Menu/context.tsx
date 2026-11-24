import * as React from 'react';
import type { View } from 'react-native';

import type { MenuColorScheme } from './tokens';

/** Host node of an enabled `MenuItem`. */
export type MenuItemRef = React.RefObject<React.ComponentRef<
  typeof View
> | null>;

/**
 * Root menu state: color scheme, and the enabled items for focus handling.
 * Provided by `Menu`; consumed by items.
 */
type MenuRootContextValue = {
  colorScheme: MenuColorScheme;
  /**
   * Enabled items in registration order. The menu focuses the first one when
   * it opens, and items link native Up / Down focus to their neighbours.
   */
  items: MenuItemRef[];
  /** Registers an enabled item. Returns an unregister function. */
  registerItem: (item: MenuItemRef) => () => void;
};

export const MenuRootContext = React.createContext<MenuRootContextValue | null>(
  null
);

export function useMenuRoot() {
  return React.useContext(MenuRootContext);
}
