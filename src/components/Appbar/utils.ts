import React from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, Animated } from 'react-native';

import { AppbarTokens, type TopAppBarMode } from './tokens';
import { white } from '../../theme/colors';
import type { InternalTheme, Theme, ThemeProp } from '../../types';

/** @deprecated Prefer `TopAppBarMode` from tokens. */
export type AppbarModes = TopAppBarMode;

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

/**
 * Resolve resting / elevated / scroll-driven container fill.
 * MD3: surface at rest → surfaceContainer when scrolled or elevated.
 */
export const getAppbarBackgroundColor = (
  theme: InternalTheme,
  _elevation: number,
  customBackground?: ColorValue,
  elevated?: boolean,
  scrollProgress?: number
) => {
  const { colors } = theme as Theme;
  if (customBackground) {
    return customBackground;
  }

  if (typeof scrollProgress === 'number') {
    // Discrete pick for non-animated consumers; full interpolation uses Animated in Appbar.
    return scrollProgress >= 0.5
      ? colors[AppbarTokens.colors.containerScrolled]
      : colors[AppbarTokens.colors.container];
  }

  if (elevated) {
    return colors[AppbarTokens.colors.containerScrolled];
  }

  return colors[AppbarTokens.colors.container];
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

export const DEFAULT_APPBAR_HEIGHT = 56;
const MD3_DEFAULT_APPBAR_HEIGHT = AppbarTokens.sizes.smallHeight;

export const modeAppbarHeight: Record<TopAppBarMode, number> = {
  small: MD3_DEFAULT_APPBAR_HEIGHT,
  medium: AppbarTokens.sizes.mediumFlexibleHeight,
  large: AppbarTokens.sizes.largeFlexibleHeight,
  'center-aligned': MD3_DEFAULT_APPBAR_HEIGHT,
  'medium-flexible': AppbarTokens.sizes.mediumFlexibleHeight,
  'large-flexible': AppbarTokens.sizes.largeFlexibleHeight,
};

export const modeTextVariant: Record<TopAppBarMode, string> = {
  small: AppbarTokens.typography.small,
  medium: AppbarTokens.typography.mediumFlexible,
  large: AppbarTokens.typography.largeFlexible,
  'center-aligned': AppbarTokens.typography.small,
  'medium-flexible': AppbarTokens.typography.mediumFlexible,
  'large-flexible': AppbarTokens.typography.largeFlexible,
};

/** Normalize deprecated modes to the modern mode + title alignment. */
export const resolveAppbarMode = (
  mode: TopAppBarMode
): {
  mode: TopAppBarMode;
  titleAlign: 'start' | 'center';
  isFlexible: boolean;
  isLegacyBaseline: boolean;
} => {
  if (mode === 'center-aligned') {
    return {
      mode: 'small',
      titleAlign: 'center',
      isFlexible: false,
      isLegacyBaseline: false,
    };
  }
  if (mode === 'medium') {
    return {
      mode: 'medium',
      titleAlign: 'start',
      isFlexible: false,
      isLegacyBaseline: true,
    };
  }
  if (mode === 'large') {
    return {
      mode: 'large',
      titleAlign: 'start',
      isFlexible: false,
      isLegacyBaseline: true,
    };
  }
  if (mode === 'medium-flexible' || mode === 'large-flexible') {
    return {
      mode,
      titleAlign: 'start',
      isFlexible: true,
      isLegacyBaseline: false,
    };
  }
  return {
    mode: 'small',
    titleAlign: 'start',
    isFlexible: false,
    isLegacyBaseline: false,
  };
};

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
  v3Spacing: {
    marginLeft: AppbarTokens.sizes.contentStartMargin,
  },
});
