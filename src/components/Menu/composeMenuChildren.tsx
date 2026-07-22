import * as React from 'react';
import { View } from 'react-native';

import { MenuItemLayoutContext } from './context';
import MenuItem from './MenuItem';
import MenuSection from './MenuSection';
import { MenuTokens, type MenuColorScheme } from './tokens';

type ComposeArgs = {
  children: React.ReactNode;
  colorScheme: MenuColorScheme;
  focusedKey: string | null;
  setFocusedKey: (key: string | null) => void;
  reduceMotion: boolean;
};

const isMenuItemElement = (
  child: React.ReactNode
): child is React.ReactElement<React.ComponentProps<typeof MenuItem>> =>
  React.isValidElement(child) && child.type === MenuItem;

const isMenuSectionElement = (
  child: React.ReactNode
): child is React.ReactElement<React.ComponentProps<typeof MenuSection>> =>
  React.isValidElement(child) && child.type === MenuSection;

/**
 * Count Menu.Item nodes depth-first (including inside Menu.Section).
 * Type identity only — no displayName filtering.
 */
export function countMenuItems(children: React.ReactNode): number {
  let count = 0;
  React.Children.forEach(children, (child) => {
    if (isMenuItemElement(child)) {
      count += 1;
    } else if (isMenuSectionElement(child)) {
      count += countMenuItems(
        (child.props as React.ComponentProps<typeof MenuSection>).children
      );
    }
  });
  return count;
}

/**
 * Parent-owned layout: wrap items in layout context instead of cloneElement.
 * Sections get vertical group gaps; items get first/last medium corners.
 */
export function composeMenuChildren({
  children,
  colorScheme,
  focusedKey,
  setFocusedKey,
  reduceMotion,
}: ComposeArgs): React.ReactNode {
  const totalItems = countMenuItems(children);
  let itemCursor = 0;
  let sectionCursor = 0;

  const mapNodes = (nodes: React.ReactNode): React.ReactNode =>
    React.Children.map(nodes, (child) => {
      if (isMenuSectionElement(child)) {
        const sectionIndex = sectionCursor;
        sectionCursor += 1;
        const sectionProps = child.props as React.ComponentProps<
          typeof MenuSection
        >;
        const gapStyle =
          sectionIndex > 0
            ? { marginTop: MenuTokens.sizes.groupGap }
            : undefined;

        return (
          <View
            key={`menu-section-wrap-${sectionIndex}`}
            style={gapStyle}
            testID={
              sectionIndex > 0 ? 'menu-section-gap' : 'menu-section-first'
            }
          >
            <MenuSection
              title={sectionProps.title}
              titleStyle={sectionProps.titleStyle}
              style={sectionProps.style}
              theme={sectionProps.theme}
              testID={sectionProps.testID}
            >
              {mapNodes(sectionProps.children)}
            </MenuSection>
          </View>
        );
      }

      if (!isMenuItemElement(child)) {
        return child;
      }

      const index = itemCursor;
      itemCursor += 1;
      const itemKey = `menu-item-${index}`;
      const childProps = child.props as React.ComponentProps<typeof MenuItem>;
      const morphActive =
        focusedKey === itemKey || Boolean(childProps.selected);

      return (
        <MenuItemLayoutContext.Provider
          key={itemKey}
          value={{
            colorScheme,
            roundedTop: index === 0,
            roundedBottom: index === totalItems - 1,
            morphActive,
            itemKey,
            setFocusedKey,
            reduceMotion,
          }}
        >
          {child}
        </MenuItemLayoutContext.Provider>
      );
    });

  return mapNodes(children);
}
