import type { ColorValue } from 'react-native';

import { createTheming } from '@callstack/react-theme-provider';
import {
  argbFromHex,
  themeFromSourceColor,
} from '@material/material-color-utilities';
import color from 'color';

import {
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from '../styles/themes';
import { tokens } from '../styles/themes/v3/tokens';
import type {
  Theme,
  MD2Theme,
  MD3Theme,
  MD3Colors,
  MD3AndroidColors,
} from '../types';

export const DefaultTheme = MD3LightTheme;

const {
  ThemeProvider,
  withTheme,
  useTheme: useThemeProviderTheme,
} = createTheming<Theme>(DefaultTheme);

const useTheme = (overrides?: Parameters<typeof useThemeProviderTheme>[0]) =>
  useThemeProviderTheme<MD2Theme | MD3Theme>(overrides);

export { ThemeProvider, withTheme, useTheme };

export const defaultThemesByVersion = {
  2: {
    light: MD2LightTheme,
    dark: MD2DarkTheme,
  },
  3: {
    light: MD3LightTheme,
    dark: MD3DarkTheme,
  },
};

export const getTheme = (isDark = false, isV3 = true) => {
  const themeVersion = isV3 ? 3 : 2;
  const scheme = isDark ? 'dark' : 'light';

  return defaultThemesByVersion[themeVersion][scheme];
};

type Config = {
  sourceColor: ColorValue;
};

type Schemes = {
  lightScheme: MD3Colors;
  darkScheme: MD3Colors;
};

export const getDynamicThemeElevations = (scheme: MD3AndroidColors) => {
  const elevationValues = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];
  return elevationValues.reduce((elevations, elevationValue, index) => {
    return {
      ...elevations,
      [`level${index}`]:
        index === 0
          ? elevationValue
          : color(scheme.surface)
              .mix(color(scheme.primary), elevationValue as number)
              .rgb()
              .string(),
    };
  }, {});
};

export const createDynamicThemeColors = ({ sourceColor }: Config): Schemes => {
  const { opacity } = tokens.md.ref;
  const modes = ['light', 'dark'] as const;

  const { schemes, palettes } = themeFromSourceColor(
    argbFromHex(color(sourceColor).hex())
  );

  const { light, dark } = modes.reduce(
    (prev, curr) => {
      const schemeModeJSON = schemes[curr].toJSON();

      const customColors = {
        surfaceDisabled: color(schemeModeJSON.onSurface)
          .alpha(opacity.level2)
          .rgb()
          .string(),
        onSurfaceDisabled: color(schemeModeJSON.onSurface)
          .alpha(opacity.level4)
          .rgb()
          .string(),
        backdrop: color(palettes.neutralVariant.tone(20))
          .alpha(0.4)
          .rgb()
          .string(),
      };

      const elevation = getDynamicThemeElevations(schemeModeJSON);

      const dynamicThemeColors = Object.assign(
        {},
        ...Object.entries(schemeModeJSON).map(([colorName, colorValue]) => ({
          [colorName]: color(colorValue).rgb().string(),
        })),
        {
          elevation,
          ...customColors,
        }
      );

      return {
        ...prev,
        [curr]: dynamicThemeColors,
      };
    },
    { light: MD3LightTheme.colors, dark: MD3DarkTheme.colors }
  );

  return { lightScheme: light, darkScheme: dark };
};
