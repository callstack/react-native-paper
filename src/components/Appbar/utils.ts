import React from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { white } from '../../theme/colors';
import type { InternalTheme, ThemeProp } from '../../theme/types';

export type AppbarModes =
  | 'small'
  /**
   * @deprecated Baseline medium app bar is not recommended in MD3 Expressive. Use 'medium-flexible' instead.
   */
  | 'medium'
  /**
   * @deprecated Baseline large app bar is not recommended in MD3 Expressive. Use 'large-flexible' instead.
   */
  | 'large'
  /**
   * Center-aligned app bar. In MD3 Expressive, consider using mode="small" with titleAlignment="center".
   */
  | 'center-aligned'
  | 'medium-flexible'
  | 'large-flexible';

export type AppbarChildProps = {
  isLeading?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
  subtitle?: React.ReactNode;
  mode?: AppbarModes;
  titleAlignment?: 'start' | 'center';
  collapsed?: boolean;
};

const borderStyleProperties = [
  'borderRadius',
  'borderBottomEndRadius',
  'borderBottomStartRadius',
  'borderEndEndRadius',
  'borderEndStartRadius',
  'borderStartEndRadius',
  'borderStartStartRadius',
  'borderTopEndRadius',
  'borderTopStartRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'borderCurve',
] satisfies readonly (keyof ViewStyle)[];

export const getAppbarBackgroundColor = (
  theme: InternalTheme,
  elevated: boolean,
  customBackground?: ColorValue
) => {
  const { colors } = theme;
  if (customBackground) {
    return customBackground;
  }

  if (elevated) {
    return colors.surfaceContainer;
  }

  return colors.surface;
};

export const getAppbarColor = ({
  color,
  isDark,
}: BaseProps & { color?: string }) => {
  if (typeof color !== 'undefined') {
    return color;
  }

  if (isDark) {
    return white;
  }

  return undefined;
};

export const getAppbarBorders = (style: ViewStyle) => {
  let borders: ViewStyle = {};

  for (const property of borderStyleProperties) {
    const value = style[property];

    if (typeof value === 'number' || typeof value === 'string') {
      borders = { ...borders, [property]: value };
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
  titleAlignment?: 'start' | 'center';
  collapsed?: boolean;
  theme?: ThemeProp;
};

export const DEFAULT_APPBAR_HEIGHT = 56;
export const MD3_DEFAULT_APPBAR_HEIGHT = 64;

export const modeAppbarHeight: Record<AppbarModes, number> = {
  small: MD3_DEFAULT_APPBAR_HEIGHT,
  medium: 112,
  large: 152,
  'center-aligned': MD3_DEFAULT_APPBAR_HEIGHT,
  'medium-flexible': 112,
  'large-flexible': 120,
};

export const modeAppbarHeightWithSubtitle: Partial<
  Record<AppbarModes, number>
> = {
  'medium-flexible': 136,
  'large-flexible': 152,
};

export const getAppbarHeight = ({
  mode = 'small',
  hasSubtitle = false,
  collapsed = false,
}: {
  mode?: AppbarModes;
  hasSubtitle?: boolean;
  collapsed?: boolean;
} = {}) => {
  if (collapsed) {
    return MD3_DEFAULT_APPBAR_HEIGHT;
  }
  const heightWithSubtitle = modeAppbarHeightWithSubtitle[mode];
  if (hasSubtitle && heightWithSubtitle) {
    return heightWithSubtitle;
  }
  return modeAppbarHeight[mode] ?? MD3_DEFAULT_APPBAR_HEIGHT;
};

export const modeTextVariant = {
  small: 'titleLarge',
  medium: 'headlineSmall',
  large: 'headlineMedium',
  'center-aligned': 'titleLarge',
  'medium-flexible': 'headlineSmall',
  'large-flexible': 'headlineMedium',
} as const;

export const filterAppbarActions = (
  children: React.ReactNode,
  isLeading = false
) => {
  const childrenArray = React.Children.toArray(children);
  const contentIndex = childrenArray.findIndex(
    (child) =>
      React.isValidElement(child) &&
      // @ts-expect-error: displayName check
      (child.type?.displayName === 'Appbar.Content' ||
        // @ts-expect-error: name check
        child.type?.name === 'AppbarContent')
  );

  return childrenArray.filter((child, index) => {
    if (!React.isValidElement<AppbarChildProps>(child)) return false;
    if (typeof child.props.isLeading === 'boolean') {
      return isLeading ? child.props.isLeading : !child.props.isLeading;
    }
    // @ts-expect-error: displayName check
    if (child.type?.displayName === 'Appbar.Image') {
      const isBeforeContent = contentIndex !== -1 ? index < contentIndex : true;
      return isLeading ? isBeforeContent : !isBeforeContent;
    }
    return isLeading ? Boolean(child.props.isLeading) : !child.props.isLeading;
  });
};

export const renderAppbarContent = ({
  children,
  isDark,
  shouldCenterContent = false,
  renderOnly,
  renderExcept,
  mode = 'small',
  titleAlignment,
  collapsed,
  theme,
}: RenderAppbarContentProps) => {
  return React.Children.toArray(children)
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
          'Appbar.Image',
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
        titleAlignment?: 'start' | 'center';
        collapsed?: boolean;
        theme?: ThemeProp;
      } = {
        theme,
        color: getAppbarColor({ color: child.props.color, isDark }),
      };

      // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
      if (child.type.displayName === 'Appbar.Content') {
        props.mode = mode;
        props.collapsed = collapsed;
        if (titleAlignment) {
          props.titleAlignment = titleAlignment;
        }
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
    marginLeft: 12,
  },
});
