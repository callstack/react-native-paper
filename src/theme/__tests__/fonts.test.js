import { afterEach, describe, expect, it, jest } from '@jest/globals';

const customFont = {
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
  displayLargeEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 64,
    fontSize: 57,
  },
  displayMediumEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmallEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 44,
    fontSize: 36,
  },
  headlineLargeEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMediumEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmallEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 32,
    fontSize: 24,
  },
  titleLargeEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 28,
    fontSize: 22,
  },
  titleMediumEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '700',
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmallEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '700',
    lineHeight: 20,
    fontSize: 14,
  },
  labelLargeEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '700',
    lineHeight: 20,
    fontSize: 14,
  },
  labelMediumEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '700',
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmallEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '700',
    lineHeight: 16,
    fontSize: 11,
  },
  bodyLargeEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMediumEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmallEmphasized: {
    fontFamily: 'NotoSans',
    letterSpacing: 0,
    fontWeight: '500',
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
  let typescale;

  jest.isolateModules(() => {
    const fonts = require('../fonts');
    configureFonts = fonts.default;

    typescale = require('../tokens').typescale;
  });

  return { configureFonts, typescale };
};

describe('configureFonts', () => {
  afterEach(() => {
    jest.dontMock('react-native');
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
    ).toEqual(customFont);
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
        letterSpacing: 0.5,
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

  it('resolves the Android font families per MD3 family assignment', () => {
    mockPlatform('android');
    const { typescale } = loadFonts();

    for (const variant of ['bodyLarge', 'bodyMedium', 'bodySmall']) {
      expect(typescale[variant]).toMatchObject({
        fontFamily: 'sans-serif',
        fontWeight: '400',
      });
    }

    for (const variant of [
      'displayLargeEmphasized',
      'displayMediumEmphasized',
      'displaySmallEmphasized',
      'headlineLargeEmphasized',
      'headlineMediumEmphasized',
      'headlineSmallEmphasized',
      'titleLargeEmphasized',
    ]) {
      expect(typescale[variant]).toMatchObject({
        fontFamily: 'sans-serif-medium',
        fontWeight: '500',
      });
    }

    for (const variant of ['displayLarge', 'headlineLarge', 'titleLarge']) {
      expect(typescale[variant]).toMatchObject({
        fontFamily: 'sans-serif',
        fontWeight: '400',
      });
    }
  });

  it('applies flat properties to every variant when the config also has per-variant entries', () => {
    mockPlatform('ios');
    const { configureFonts, typescale } = loadFonts();

    const fonts = configureFonts({
      config: {
        fontFamily: 'NotoSans',
        bodyLarge: {
          fontSize: 18,
        },
      },
    });

    expect(fonts).toEqual({
      ...Object.fromEntries(
        Object.entries(typescale).map(([variantName, variantProperties]) => [
          variantName,
          { ...variantProperties, fontFamily: 'NotoSans' },
        ])
      ),
      bodyLarge: {
        ...typescale.bodyLarge,
        fontFamily: 'NotoSans',
        fontSize: 18,
      },
    });
  });

  it('does not add flat properties of a mixed config as typescale variants', () => {
    mockPlatform('ios');
    const { configureFonts } = loadFonts();

    const fonts = configureFonts({
      config: {
        fontFamily: 'NotoSans',
        bodyLarge: {
          fontSize: 18,
        },
      },
    });

    expect(fonts.fontFamily).toBeUndefined();
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
