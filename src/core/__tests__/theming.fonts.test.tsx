import type { Theme as ReactNavigationTheme } from '@react-navigation/native';

import { MD3DarkTheme, MD3LightTheme } from '../../styles/themes';
import { typescale } from '../../styles/themes/v3/tokens';
import { adaptNavigationTheme } from '../theming';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: (o: any) => o['web'],
}));

const NavigationFonts: ReactNavigationTheme['fonts'] = {
  regular: {
    fontFamily: 'system-ui',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'system-ui',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'system-ui',
    fontWeight: '600',
  },
  heavy: {
    fontFamily: 'system-ui',
    fontWeight: '700',
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
  fonts: NavigationFonts,
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
  fonts: NavigationFonts,
};

const boldFont = {
  fontFamily: 'MyCustomBoldFont',
  fontWeight: '500' as '500',
  letterSpacing: 1,
  lineHeight: 1.5,
  fontSize: 16,
};

const regularFont = {
  fontFamily: 'MyCustomRegularFont',
  fontWeight: '400' as '400',
  letterSpacing: 1,
  lineHeight: 1.5,
  fontSize: 16,
};

const AppCustomFonts = {
  displayLarge: boldFont,
  displayMedium: boldFont,
  displaySmall: boldFont,
  headlineLarge: boldFont,
  headlineMedium: boldFont,
  headlineSmall: boldFont,
  titleLarge: regularFont,
  titleMedium: regularFont,
  titleSmall: regularFont,
  labelLarge: regularFont,
  labelMedium: regularFont,
  labelSmall: regularFont,
  bodyLarge: regularFont,
  bodyMedium: regularFont,
  bodySmall: regularFont,
  default: regularFont,
};

const AppCustomLightTheme = {
  ...MD3LightTheme,
  fonts: AppCustomFonts,
};

const AppCustomDarkTheme = {
  ...MD3DarkTheme,
  fonts: AppCustomFonts,
};

describe('adaptNavigationTheme', () => {
  it("should return adapted theme with Paper's fonts based on platform", () => {
    const { LightTheme, DarkTheme } = adaptNavigationTheme({
      reactNavigationDark: NavigationDarkTheme,
      reactNavigationLight: NavigationLightTheme,
    });

    expect(LightTheme.fonts).toMatchObject({
      regular: {
        fontFamily: typescale.bodyMedium.fontFamily,
        fontWeight: typescale.bodyMedium.fontWeight,
      },
      medium: {
        fontFamily: typescale.headlineMedium.fontFamily,
        fontWeight: typescale.headlineMedium.fontWeight,
      },
      heavy: {
        fontFamily: typescale.headlineMedium.fontFamily,
        fontWeight: typescale.headlineMedium.fontWeight,
      },
      bold: {
        fontFamily: typescale.headlineMedium.fontFamily,
        fontWeight: typescale.headlineMedium.fontWeight,
      },
    });

    expect(DarkTheme.fonts).toMatchObject({
      regular: {
        fontFamily: typescale.bodyMedium.fontFamily,
        fontWeight: typescale.bodyMedium.fontWeight,
      },
      medium: {
        fontFamily: typescale.headlineMedium.fontFamily,
        fontWeight: typescale.headlineMedium.fontWeight,
      },
      heavy: {
        fontFamily: typescale.headlineMedium.fontFamily,
        fontWeight: typescale.headlineMedium.fontWeight,
      },
      bold: {
        fontFamily: typescale.headlineMedium.fontFamily,
        fontWeight: typescale.headlineMedium.fontWeight,
      },
    });
  });

  it("should return adapted theme with Paper's custom fonts", () => {
    const { LightTheme, DarkTheme } = adaptNavigationTheme({
      reactNavigationDark: NavigationDarkTheme,
      reactNavigationLight: NavigationLightTheme,
      materialLight: AppCustomLightTheme,
      materialDark: AppCustomDarkTheme,
    });

    expect(LightTheme.fonts).toMatchObject({
      regular: {
        fontFamily: AppCustomFonts.bodyMedium.fontFamily,
        fontWeight: AppCustomFonts.bodyMedium.fontWeight,
      },
      medium: {
        fontFamily: AppCustomFonts.headlineMedium.fontFamily,
        fontWeight: AppCustomFonts.headlineMedium.fontWeight,
      },
      heavy: {
        fontFamily: AppCustomFonts.headlineMedium.fontFamily,
        fontWeight: AppCustomFonts.headlineMedium.fontWeight,
      },
      bold: {
        fontFamily: AppCustomFonts.headlineMedium.fontFamily,
        fontWeight: AppCustomFonts.headlineMedium.fontWeight,
      },
    });

    expect(DarkTheme.fonts).toMatchObject({
      regular: {
        fontFamily: AppCustomFonts.bodyMedium.fontFamily,
        fontWeight: AppCustomFonts.bodyMedium.fontWeight,
      },
      medium: {
        fontFamily: AppCustomFonts.headlineMedium.fontFamily,
        fontWeight: AppCustomFonts.headlineMedium.fontWeight,
      },
      heavy: {
        fontFamily: AppCustomFonts.headlineMedium.fontFamily,
        fontWeight: AppCustomFonts.headlineMedium.fontWeight,
      },
      bold: {
        fontFamily: AppCustomFonts.headlineMedium.fontFamily,
        fontWeight: AppCustomFonts.headlineMedium.fontWeight,
      },
    });
  });
});
