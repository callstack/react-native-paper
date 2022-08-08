import color from 'color';
import { getFABGroupColors } from '../FAB/utils';
import { getTheme } from '../../core/theming';

describe('getFABGroupColors - backdrop color', () => {
  it('should return custom color', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
        customBackdropColor: 'transparent',
      })
    ).toMatchObject({
      backdropColor: 'transparent',
    });
  });

  it('should return correct backdrop color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      backdropColor: color(getTheme().colors.background)
        .alpha(0.95)
        .rgb()
        .string(),
    });
  });

  it('should return correct backdrop color, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      backdropColor: getTheme(false, false).colors.backdrop,
    });
  });
});

describe('getFABGroupColors - label color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      labelColor: getTheme().colors.onSurface,
    });
  });

  it('should return correct theme color, dark mode, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      labelColor: getTheme(true, false).colors.text,
    });
  });

  it('should return correct theme color, light mode, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      labelColor: color(getTheme(false, false).colors.text)
        .fade(0.54)
        .rgb()
        .string(),
    });
  });
});

describe('getFABGroupColors - stacked FAB background color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      stackedFABBackgroundColor: getTheme().colors.elevation.level3,
    });
  });

  it('should return correct theme color, dark mode, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      stackedFABBackgroundColor: getTheme(false, false).colors.surface,
    });
  });
});
