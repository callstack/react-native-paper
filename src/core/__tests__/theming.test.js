import { MD3DarkTheme, MD3LightTheme } from '../../styles/themes';
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
