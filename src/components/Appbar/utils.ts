import React from 'react';
import { StyleSheet } from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import AppbarContent from './AppbarContent';
import AppbarAction from './AppbarAction';
import AppbarBackAction from './AppbarBackAction';
import overlay from '../../styles/overlay';
import type { Theme } from '../../types';
import { black, white } from '../../styles/themes/v2/colors';

export type AppbarModes = 'small' | 'medium' | 'large' | 'center-aligned';

export const getAppbarColor = (
  theme: Theme,
  elevation: number,
  customBackground?: ColorValue
) => {
  const { isV3, md, dark: isDarkTheme, mode, colors } = theme;
  const isAdaptiveMode = mode === 'adaptive';
  let backgroundColor;
  if (customBackground) {
    backgroundColor = customBackground;
  } else if (isV3) {
    backgroundColor = md('md.sys.color.surface') as string;
  } else if (isDarkTheme && isAdaptiveMode) {
    backgroundColor = overlay(elevation, colors?.surface);
  } else backgroundColor = colors?.primary;

  return backgroundColor;
};

type RenderAppbarContentProps = {
  children: React.ReactNode;
  isDark: boolean;
  shouldCenterContent?: boolean;
  theme: Theme;
  renderOnly?: (
    | typeof AppbarContent
    | typeof AppbarAction
    | typeof AppbarBackAction
  )[];
  mode?: AppbarModes;
};

export const DEFAULT_APPBAR_HEIGHT = 56;

export const modeAppbarHeight = {
  small: DEFAULT_APPBAR_HEIGHT,
  medium: 112,
  large: 152,
  'center-aligned': DEFAULT_APPBAR_HEIGHT,
};

export const modeTextVariant = {
  small: 'title-large',
  medium: 'headline-small',
  large: 'headline-medium',
  'center-aligned': 'title-large',
};

export const renderAppbarContent = ({
  children,
  isDark,
  shouldCenterContent = false,
  theme,
  renderOnly = [AppbarContent, AppbarAction, AppbarBackAction],
  mode = 'small',
}: RenderAppbarContentProps) => {
  const { isV3 } = theme;
  return (
    React.Children.toArray(children)
      .filter((child) => child != null && typeof child !== 'boolean')
      // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
      .filter((child) => renderOnly.includes(child.type))
      .map((child, i) => {
        if (
          !React.isValidElement(child) ||
          ![AppbarContent, AppbarAction, AppbarBackAction].includes(
            // @ts-expect-error: TypeScript complains about the type of type but it doesn't matter
            child.type
          )
        ) {
          return child;
        }

        const props: {
          color?: string;
          style?: StyleProp<ViewStyle>;
          mode?: AppbarModes;
        } = {
          color:
            typeof child.props.color !== 'undefined'
              ? child.props.color
              : isDark
              ? white
              : black,
        };

        if (child.type === AppbarContent) {
          props.mode = mode;
          props.style = [
            isV3 ? i === 0 && styles.v3Spacing : i !== 0 && styles.v2Spacing,
            shouldCenterContent && isV3 && styles.v3CenterAlignedContent,
            shouldCenterContent && !isV3 && styles.v2CenterAlignedContent,
            child.props.style,
          ];
        }
        return React.cloneElement(child, props);
      })
  );
};

const styles = StyleSheet.create({
  v2Spacing: {
    marginLeft: 8,
  },
  v2CenterAlignedContent: {
    alignItems: 'center',
  },
  v3Spacing: {
    marginLeft: 12,
  },
  v3CenterAlignedContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
