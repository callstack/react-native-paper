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

const mockPlatform = (OS) => {
  jest.resetModules();

  jest.doMock('react-native', () => ({
    Platform: {
      OS,
      select: (objs) => objs[OS] ?? objs.default ?? objs.ios,
    },
  }));
};

const loadFonts = () => {
  let configureFonts;
  let fontConfig;
  let typescale;

  jest.isolateModules(() => {
    const fonts = require('../fonts');
    configureFonts = fonts.default;
    fontConfig = fonts.fontConfig;

    typescale = require('../themes/v3/tokens').typescale;
  });

  return { configureFonts, fontConfig, typescale };
};

describe('configureFonts', () => {
  afterEach(() => {
    jest.dontMock('react-native');
  });

  it('adds custom fonts to the iOS config', () => {
    mockPlatform('ios');
    const { configureFonts, fontConfig } = loadFonts();

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
    const { configureFonts, fontConfig } = loadFonts();

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
    const { configureFonts, fontConfig } = loadFonts();

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
    mockPlatform('ios');
    const { configureFonts } = loadFonts();

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
    mockPlatform('ios');
    const { configureFonts, typescale } = loadFonts();

    expect(
      configureFonts({
        config: {
          bodyLarge: {
            fontFamily: 'NotoSans',
            fontSize: 18,
            fontStyle: 'italic',
          },
          headlineMedium: {
            fontSize: 30,
          },
          bodySmall: {
            fontStyle: 'italic',
          },
        },
      })
    ).toEqual({
      ...typescale,
      bodyLarge: {
        fontFamily: 'NotoSans',
        letterSpacing: 0.15,
        fontWeight: '400',
        fontStyle: 'italic',
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
      bodySmall: {
        fontFamily: 'System',
        fontWeight: '400',
        fontStyle: 'italic',
        letterSpacing: 0.4,
        lineHeight: 16,
        fontSize: 12,
      },
    });
  });

  it('adds custom variant to theme fonts', () => {
    mockPlatform('ios');
    const { configureFonts, typescale } = loadFonts();

    expect(
      configureFonts({
        config: {
          customVariant: {
            fontFamily: 'NotoSans',
            letterSpacing: 0,
            fontWeight: '400',
            fontStyle: 'italic',
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
        fontStyle: 'italic',
        lineHeight: 64,
        fontSize: 57,
      },
    });
  });

  it('should be deterministic', () => {
    mockPlatform('ios');
    const { configureFonts } = loadFonts();

    configureFonts({
      config: {
        labelMedium: {
          color: 'coral',
        },
      },
    });

    const fontsB = configureFonts({ config: {} });

    expect(fontsB.labelMedium.color).toBeUndefined();
  });
});
