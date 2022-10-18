import {
  argbFromHex,
  themeFromSourceColor,
} from '@material/material-color-utilities';
import color from 'color';

import { MD3DarkTheme, MD3LightTheme } from '../../styles/themes';
import { tokens } from '../../styles/themes/v3/tokens';
import {
  createDynamicThemeColors,
  getDynamicThemeElevations,
  adaptNavigationTheme,
} from '../theming';

const sourceColor = 'rgba(200, 100, 0, 1)';

const dynamicThemeColors = {
  lightScheme: {
    primary: 'rgb(150, 73, 0)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 220, 198)',
    onPrimaryContainer: 'rgb(49, 19, 0)',
    secondary: 'rgb(117, 88, 70)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 220, 198)',
    onSecondaryContainer: 'rgb(43, 23, 8)',
    tertiary: 'rgb(96, 97, 52)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(229, 230, 173)',
    onTertiaryContainer: 'rgb(28, 29, 0)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(32, 26, 23)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(32, 26, 23)',
    surfaceVariant: 'rgb(244, 222, 211)',
    onSurfaceVariant: 'rgb(82, 68, 60)',
    outline: 'rgb(132, 116, 106)',
    outlineVariant: 'rgb(215, 195, 183)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(54, 47, 43)',
    inverseOnSurface: 'rgb(251, 238, 232)',
    inversePrimary: 'rgb(255, 183, 134)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(250, 242, 242)',
      level2: 'rgb(247, 237, 235)',
      level3: 'rgb(244, 231, 227)',
      level4: 'rgb(242, 230, 224)',
      level5: 'rgb(240, 226, 219)',
    },
    surfaceDisabled: 'rgba(32, 26, 23, 0.12)',
    onSurfaceDisabled: 'rgba(32, 26, 23, 0.38)',
    backdrop: 'rgba(58, 46, 38, 0.4)',
  },
  darkScheme: {
    primary: 'rgb(255, 183, 134)',
    onPrimary: 'rgb(80, 36, 0)',
    primaryContainer: 'rgb(114, 54, 0)',
    onPrimaryContainer: 'rgb(255, 220, 198)',
    secondary: 'rgb(229, 191, 168)',
    onSecondary: 'rgb(66, 43, 27)',
    secondaryContainer: 'rgb(91, 65, 48)',
    onSecondaryContainer: 'rgb(255, 220, 198)',
    tertiary: 'rgb(201, 202, 147)',
    onTertiary: 'rgb(49, 50, 10)',
    tertiaryContainer: 'rgb(72, 73, 31)',
    onTertiaryContainer: 'rgb(229, 230, 173)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(32, 26, 23)',
    onBackground: 'rgb(236, 224, 218)',
    surface: 'rgb(32, 26, 23)',
    onSurface: 'rgb(236, 224, 218)',
    surfaceVariant: 'rgb(82, 68, 60)',
    onSurfaceVariant: 'rgb(215, 195, 183)',
    outline: 'rgb(159, 141, 131)',
    outlineVariant: 'rgb(82, 68, 60)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(236, 224, 218)',
    inverseOnSurface: 'rgb(54, 47, 43)',
    inversePrimary: 'rgb(150, 73, 0)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(43, 34, 29)',
      level2: 'rgb(50, 39, 32)',
      level3: 'rgb(57, 43, 35)',
      level4: 'rgb(59, 45, 36)',
      level5: 'rgb(63, 48, 39)',
    },
    surfaceDisabled: 'rgba(236, 224, 218, 0.12)',
    onSurfaceDisabled: 'rgba(236, 224, 218, 0.38)',
    backdrop: 'rgba(58, 46, 38, 0.4)',
  },
};

const NavigationLightTheme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};

const NavigationDarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};

const NavigationCustomLightTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    secondary: 'rgb(150,45,85)',
    tertiary: 'rgb(105,45,85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

describe('createDynamicThemeColors', () => {
  it('should return dark and light theme colors schemes based on source color', () => {
    const { darkScheme, lightScheme } = createDynamicThemeColors({
      sourceColor,
    });

    expect(darkScheme).toMatchObject(dynamicThemeColors.darkScheme);
    expect(lightScheme).toMatchObject(dynamicThemeColors.lightScheme);
  });

  it('should return color keys equal to MD3 theme color keys', () => {
    const { darkScheme, lightScheme } = createDynamicThemeColors({
      sourceColor,
    });

    const darkColorKeys = Object.keys(darkScheme).sort();
    const lightColorKeys = Object.keys(lightScheme).sort();

    expect(darkColorKeys).toEqual(Object.keys(MD3DarkTheme.colors).sort());
    expect(lightColorKeys).toEqual(Object.keys(MD3LightTheme.colors).sort());
  });

  [('darkScheme', 'lightScheme')].forEach((mode) => {
    it(`should contain correct elevation colors for ${mode}`, () => {
      const dynamicThemeColors = createDynamicThemeColors({
        sourceColor,
      });
      const dynamicThemeElevations = getDynamicThemeElevations(
        dynamicThemeColors[mode]
      );

      expect(dynamicThemeColors[mode].elevation).toMatchObject(
        dynamicThemeElevations
      );
    });
  });

  ['darkScheme', 'lightScheme'].forEach((mode) => {
    it(`should contain custom colors for ${mode}`, () => {
      const dynamicThemeColors = createDynamicThemeColors({
        sourceColor,
      });

      const { palettes } = themeFromSourceColor(
        argbFromHex(color(sourceColor).hex())
      );

      const { opacity } = tokens.md.ref;

      const customColors = {
        surfaceDisabled: color(dynamicThemeColors[mode].onSurface)
          .alpha(opacity.level2)
          .rgb()
          .string(),
        onSurfaceDisabled: color(dynamicThemeColors[mode].onSurface)
          .alpha(opacity.level4)
          .rgb()
          .string(),
        backdrop: color(palettes.neutralVariant.tone(20))
          .alpha(0.4)
          .rgb()
          .string(),
      };

      ['surfaceDisabled', 'onSurfaceDisabled', 'backdrop'].forEach(
        (customColor) => {
          expect(dynamicThemeColors[mode][customColor]).toBe(
            customColors[customColor]
          );
        }
      );
    });
  });
});

describe('adaptNavigationTheme', () => {
  it('should return adapted both navigation themes', () => {
    const themes = adaptNavigationTheme({
      light: NavigationLightTheme,
      dark: NavigationDarkTheme,
    });

    expect(themes).toMatchObject({
      LightTheme: {
        ...NavigationLightTheme,
        colors: {
          ...NavigationLightTheme.colors,
          primary: MD3LightTheme.colors.primary,
          background: MD3LightTheme.colors.background,
          card: MD3LightTheme.colors.elevation.level2,
          text: MD3LightTheme.colors.onSurface,
          border: MD3LightTheme.colors.outline,
          notification: MD3LightTheme.colors.error,
        },
      },
      DarkTheme: {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          primary: MD3DarkTheme.colors.primary,
          background: MD3DarkTheme.colors.background,
          card: MD3DarkTheme.colors.elevation.level2,
          text: MD3DarkTheme.colors.onSurface,
          border: MD3DarkTheme.colors.outline,
          notification: MD3DarkTheme.colors.error,
        },
      },
    });
  });

  it('should return adapted navigation light theme', () => {
    const { LightTheme } = adaptNavigationTheme({
      light: NavigationLightTheme,
    });

    const { colors } = MD3LightTheme;

    expect(LightTheme).toMatchObject({
      ...NavigationLightTheme,
      colors: {
        ...NavigationLightTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.elevation.level2,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
      },
    });
  });

  it('should return adapted navigation dark theme', () => {
    const { DarkTheme } = adaptNavigationTheme({
      dark: NavigationDarkTheme,
    });

    const { colors } = MD3DarkTheme;

    expect(DarkTheme).toMatchObject({
      ...NavigationDarkTheme,
      colors: {
        ...NavigationDarkTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.elevation.level2,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
      },
    });
  });

  it('should return adapted custom navigation theme', () => {
    const { LightTheme } = adaptNavigationTheme({
      light: NavigationCustomLightTheme,
    });

    const { colors } = MD3LightTheme;

    expect(LightTheme).toMatchObject({
      ...NavigationCustomLightTheme,
      colors: {
        ...NavigationCustomLightTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.elevation.level2,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
        secondary: 'rgb(150,45,85)',
        tertiary: 'rgb(105,45,85)',
      },
    });
  });
});
