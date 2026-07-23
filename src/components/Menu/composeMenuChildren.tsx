import * as React from 'react';

import { MenuItemLayoutContext } from './context';
import MenuItem from './MenuItem';
import type { MenuColorScheme } from './tokens';

type ComposeArgs = {
  children: React.ReactNode;
  colorScheme: MenuColorScheme;
};

const isMenuItemElement = (
  child: React.ReactNode
): child is React.ReactElement<React.ComponentProps<typeof MenuItem>> =>
  React.isValidElement(child) && child.type === MenuItem;

/**
 * Count Menu.Item nodes. Type identity only — no displayName filtering.
 */
export function countMenuItems(children: React.ReactNode): number {
  let count = 0;
  React.Children.forEach(children, (child) => {
    if (isMenuItemElement(child)) {
      count += 1;
    }
  });
  return count;
}

/**
 * Parent-owned layout: wrap items in layout context instead of cloneElement.
 * Items get first/last medium corners via context.
 */
export function composeMenuChildren({
  children,
  colorScheme,
}: ComposeArgs): React.ReactNode {
  const totalItems = countMenuItems(children);
  let itemCursor = 0;

  return React.Children.map(children, (child) => {
    if (!isMenuItemElement(child)) {
      return child;
    }

    const index = itemCursor;
    itemCursor += 1;

    return (
      <MenuItemLayoutContext.Provider
        key={`menu-item-${index}`}
        value={{
          colorScheme,
          roundedTop: index === 0,
          roundedBottom: index === totalItems - 1,
        }}
      >
        {child}
      </MenuItemLayoutContext.Provider>
    );
  });
}
