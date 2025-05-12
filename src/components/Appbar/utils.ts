import React from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Animated } from 'react-native';

import { white } from '../../styles/themes/v2/colors';
import type { InternalTheme, ThemeProp } from '../../types';

export type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

export type AppbarChildProps = {
  isLeading?: boolean;
  color: string;
  style?: StyleProp<ViewStyle>;
};

const borderStyleProperties = [
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
];

export const getAppbarBackgroundColor = (
  theme: InternalTheme,
  customBackground?: ColorValue,
  elevated?: boolean
) => {
  const {
    colors: { surface, elevation },
  } = theme;
  if (customBackground) {
    return customBackground;
  }

  if (elevated) {
    return elevation.level2;
  }

  return surface;
};

export const getAppbarColor = ({
  color,
  isDark,
}: BaseProps & { color: string }) => {
  if (typeof color !== 'undefined') {
    return color;
  }

  if (isDark) {
    return white;
  }

  return undefined;
};

export const getAppbarBorders = (
  style:
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | Animated.WithAnimatedObject<ViewStyle>
) => {
  const borders: Record<string, number> = {};

  for (const property of borderStyleProperties) {
    const value = style[property as keyof typeof style];
    if (value) {
      borders[property] = value;
    }
  }

  return borders;
};

type BaseProps = {
  isDark: boolean;
};

type RenderAppbarContentProps = BaseProps & {
  children: React.ReactNode;
  shouldCenterContent?: boolean;
  renderOnly?: (string | boolean)[];
  renderExcept?: string[];
  mode?: AppbarModes;
  theme?: ThemeProp;
};

const MD3_DEFAULT_APPBAR_HEIGHT = 64;

export const modeAppbarHeight = {
  small: MD3_DEFAULT_APPBAR_HEIGHT,
  medium: 112,
  large: 152,
  'center-aligned': MD3_DEFAULT_APPBAR_HEIGHT,
};

export const modeTextVariant = {
  small: 'titleLarge',
  medium: 'headlineSmall',
  large: 'headlineMedium',
  'center-aligned': 'titleLarge',
} as const;

/**
 * Filtruje akcje w Appbarze na podstawie właściwości isLeading.
 * @param children - Dzieci komponentu Appbar do przefiltrowania
 * @param isLeading - Czy filtrować akcje wiodące (true) czy niewiodące (false). Domyślnie false.
 * @returns Przefiltrowana tablica elementów React
 */
export const filterAppbarActions = (
  children: React.ReactNode,
  isLeading = false
) => {
  return React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement<AppbarChildProps>(child)) return false;
    return isLeading ? child.props.isLeading : !child.props.isLeading;
  });
};

export const renderAppbarContent = ({
  children,
  isDark,
  shouldCenterContent = false,
  renderOnly,
  renderExcept,
  mode = 'small',
  theme,
}: RenderAppbarContentProps) => {
  return React.Children.toArray(children as React.ReactNode | React.ReactNode[])
    .filter((child) => child != null && typeof child !== 'boolean')
    .filter((child) =>
      // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
      renderExcept ? !renderExcept.includes(child.type.displayName) : child
    )
    .filter((child) =>
      // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
      renderOnly ? renderOnly.includes(child.type.displayName) : child
    )
    .map((child, i) => {
      if (
        !React.isValidElement<AppbarChildProps>(child) ||
        ![
          'Appbar.Content',
          'Appbar.Action',
          'Appbar.BackAction',
          'Tooltip',
        ].includes(
          // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
          child.type.displayName
        )
      ) {
        return child;
      }

      const props: {
        color?: string;
        style?: StyleProp<ViewStyle>;
        mode?: AppbarModes;
        theme?: ThemeProp;
      } = {
        theme,
        color: getAppbarColor({ color: child.props.color, isDark }),
      };

      // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
      if (child.type.displayName === 'Appbar.Content') {
        props.mode = mode;
        props.style = [
          i === 0 && !shouldCenterContent && styles.v3Spacing,
          shouldCenterContent && styles.centerAlignedContent,
          child.props.style,
        ];
        props.color;
      }
      return React.cloneElement(child, props);
    });
};

const styles = StyleSheet.create({
  centerAlignedContent: {
    alignItems: 'center',
  },
  v2Spacing: {
    marginLeft: 8,
  },
  v3Spacing: {
    marginLeft: 12,
  },
});
