import configureFonts, { fontConfig } from '../fonts';

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

describe('configureFonts', () => {
  it('adds custom fonts to the iOS config', () => {
    mockPlatform('ios');
    expect(
      configureFonts({
        ios: {
          ...fontConfig.ios,
          customFont,
        },
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
        android: {
          ...fontConfig.android,
          customFont,
        },
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
        web: {
          ...fontConfig.web,
          customFont,
        },
      })
    ).toEqual({
      ...fontConfig.web,
      customFont,
    });
  });
});
