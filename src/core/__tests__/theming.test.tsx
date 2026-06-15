import { describe, expect, it } from '@jest/globals';

import { DarkTheme, LightTheme } from '../../theme/schemes';
import { adaptNavigationTheme } from '../theming';

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

const AppCustomLightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: 'purple',
  },
};

const AppCustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'orchid',
  },
};

const NavigationThemeWithFonts = {
  ...NavigationLightTheme,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800',
    },
  },
};

describe('adaptNavigationTheme', () => {
  it('should return adapted both navigation themes', () => {
    const themes = adaptNavigationTheme({
      reactNavigationLight: NavigationLightTheme,
      reactNavigationDark: NavigationDarkTheme,
    });

    expect(themes).toMatchObject({
      LightTheme: {
        ...NavigationLightTheme,
        colors: {
          ...NavigationLightTheme.colors,
          primary: LightTheme.colors.primary,
          background: LightTheme.colors.background,
          card: LightTheme.colors.surfaceContainer,
          text: LightTheme.colors.onSurface,
          border: LightTheme.colors.outline,
          notification: LightTheme.colors.error,
        },
      },
      DarkTheme: {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          primary: DarkTheme.colors.primary,
          background: DarkTheme.colors.background,
          card: DarkTheme.colors.surfaceContainer,
          text: DarkTheme.colors.onSurface,
          border: DarkTheme.colors.outline,
          notification: DarkTheme.colors.error,
        },
      },
    });
  });

  it('should return adapted navigation light theme', () => {
    const { LightTheme: navLight } = adaptNavigationTheme({
      reactNavigationLight: NavigationLightTheme,
    });

    const { colors } = LightTheme;

    expect(navLight).toMatchObject({
      ...NavigationLightTheme,
      colors: {
        ...NavigationLightTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surfaceContainer,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
      },
    });
  });

  it('should return adapted navigation dark theme', () => {
    const { DarkTheme: navDark } = adaptNavigationTheme({
      reactNavigationDark: NavigationDarkTheme,
    });

    const { colors } = DarkTheme;

    expect(navDark).toMatchObject({
      ...NavigationDarkTheme,
      colors: {
        ...NavigationDarkTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surfaceContainer,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
      },
    });
  });

  it('should return adapted custom navigation theme', () => {
    const { LightTheme: navLight } = adaptNavigationTheme({
      reactNavigationLight: NavigationCustomLightTheme,
    });

    const { colors } = LightTheme;

    expect(navLight).toMatchObject({
      ...NavigationCustomLightTheme,
      colors: {
        ...NavigationCustomLightTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surfaceContainer,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
        secondary: 'rgb(150,45,85)',
        tertiary: 'rgb(105,45,85)',
      },
    });
  });

  it('should return adapted navigation light theme based on custom app light theme', () => {
    const { LightTheme: navLight } = adaptNavigationTheme({
      reactNavigationLight: NavigationLightTheme,
      materialLight: AppCustomLightTheme,
    });

    const { colors } = AppCustomLightTheme;

    expect(navLight).toMatchObject({
      ...NavigationLightTheme,
      colors: {
        ...NavigationLightTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surfaceContainer,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
      },
    });
  });

  it('should return adapted navigation dark theme based on custom app dark theme', () => {
    const { DarkTheme: navDark } = adaptNavigationTheme({
      reactNavigationDark: NavigationDarkTheme,
      materialDark: AppCustomDarkTheme,
    });

    const { colors } = AppCustomDarkTheme;

    expect(navDark).toMatchObject({
      ...NavigationDarkTheme,
      colors: {
        ...NavigationDarkTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surfaceContainer,
        text: colors.onSurface,
        border: colors.outline,
        notification: colors.error,
      },
    });
  });

  it('should adapt navigation theme with fonts', () => {
    const { LightTheme: navLight } = adaptNavigationTheme({
      reactNavigationLight: NavigationThemeWithFonts,
    });

    expect(navLight).toMatchObject({
      ...NavigationThemeWithFonts,
      colors: {
        ...NavigationThemeWithFonts.colors,
        primary: LightTheme.colors.primary,
        background: LightTheme.colors.background,
        card: LightTheme.colors.surfaceContainer,
        text: LightTheme.colors.onSurface,
        border: LightTheme.colors.outline,
        notification: LightTheme.colors.error,
      },
      fonts: {
        regular: {
          fontFamily: LightTheme.fonts.bodyMedium.fontFamily,
          fontWeight: LightTheme.fonts.bodyMedium.fontWeight,
          letterSpacing: LightTheme.fonts.bodyMedium.letterSpacing,
        },
        medium: {
          fontFamily: LightTheme.fonts.titleMedium.fontFamily,
          fontWeight: LightTheme.fonts.titleMedium.fontWeight,
          letterSpacing: LightTheme.fonts.titleMedium.letterSpacing,
        },
        bold: {
          fontFamily: LightTheme.fonts.headlineSmall.fontFamily,
          fontWeight: LightTheme.fonts.headlineSmall.fontWeight,
          letterSpacing: LightTheme.fonts.headlineSmall.letterSpacing,
        },
        heavy: {
          fontFamily: LightTheme.fonts.headlineLarge.fontFamily,
          fontWeight: LightTheme.fonts.headlineLarge.fontWeight,
          letterSpacing: LightTheme.fonts.headlineLarge.letterSpacing,
        },
      },
    });
  });

  it('should not expect fonts on theme without fonts', () => {
    const { LightTheme: navLight, DarkTheme: navDark } = adaptNavigationTheme({
      reactNavigationLight: NavigationLightTheme,
      reactNavigationDark: NavigationDarkTheme,
    });

    expect(navLight).not.toHaveProperty('fonts');
    expect(navDark).not.toHaveProperty('fonts');
  });
});
