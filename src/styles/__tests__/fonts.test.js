import configureFonts, { fontConfig } from '../fonts';
import { typescale } from '../themes/v3/tokens';

const mockPlatform = (OS) => {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS,
    select: (objs) => objs[OS],
  }));
};

const customFont = {
  custom: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
  },
};

const customFontV3 = {
  displayLarge: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 64,
    fontSize: 57,
  },
  displayMedium: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmall: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 44,
    fontSize: 36,
  },

  headlineLarge: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMedium: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmall: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 32,
    fontSize: 24,
  },

  titleLarge: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 28,
    fontSize: 22,
  },
  titleMedium: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmall: {
    fontFamily: 'NotoSans',
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    fontSize: 14,
  },

  labelLarge: {
    fontFamily: 'NotoSans',
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    fontSize: 14,
  },
  labelMedium: {
    fontFamily: 'NotoSans',
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmall: {
    fontFamily: 'NotoSans',
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 16,
    fontSize: 11,
  },

  bodyLarge: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMedium: {
    fontFamily: 'NotoSans',
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmall: {
    fontFamily: 'NotoSans',
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
    fontSize: 12,
  },

  default: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '400',
  },
};

describe('configureFonts', () => {
  it('adds custom fonts to the iOS config', () => {
    mockPlatform('ios');
    expect(
      configureFonts({
        config: {
          ios: {
            ...fontConfig.ios,
            customFont,
          },
        },
        isV3: false,
      })
    ).toEqual({
      ...fontConfig.ios,
      customFont,
    });
  });

  it('adds custom fonts to the Android config', () => {
    mockPlatform('android');
    expect(
      configureFonts({
        config: {
          android: {
            ...fontConfig.android,
            customFont,
          },
        },
        isV3: false,
      })
    ).toEqual({
      ...fontConfig.android,
      customFont,
    });
  });

  it('adds custom fonts to the Web config', () => {
    mockPlatform('web');
    expect(
      configureFonts({
        config: {
          web: {
            ...fontConfig.web,
            customFont,
          },
        },
        isV3: false,
      })
    ).toEqual({
      ...fontConfig.web,
      customFont,
    });
  });

  it('overrides properties passed in config for all variants', () => {
    expect(
      configureFonts({
        config: {
          fontFamily: 'NotoSans',
          letterSpacing: 0,
        },
      })
    ).toEqual(customFontV3);
  });

  it('overrides properties passed in config for several variants', () => {
    expect(
      configureFonts({
        config: {
          bodyLarge: {
            fontFamily: 'NotoSans',
            fontSize: 18,
          },
          headlineMedium: {
            fontSize: 30,
          },
        },
      })
    ).toEqual({
      ...typescale,
      bodyLarge: {
        fontFamily: 'NotoSans',
        letterSpacing: 0.15,
        fontWeight: '400',
        lineHeight: 24,
        fontSize: 18,
      },
      headlineMedium: {
        fontFamily: 'System',
        letterSpacing: 0,
        fontWeight: '400',
        lineHeight: 36,
        fontSize: 30,
      },
    });
  });

  it('adds custom variant to theme fonts', () => {
    expect(
      configureFonts({
        config: {
          customVariant: {
            fontFamily: 'NotoSans',
            letterSpacing: 0,
            fontWeight: '400',
            lineHeight: 64,
            fontSize: 57,
          },
        },
      })
    ).toEqual({
      ...typescale,
      customVariant: {
        fontFamily: 'NotoSans',
        letterSpacing: 0,
        fontWeight: '400',
        lineHeight: 64,
        fontSize: 57,
      },
    });
  });
});
