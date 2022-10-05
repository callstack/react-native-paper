import color from 'color';

import { getTheme } from '../../../core/theming';
import {
  getAndroidSelectionControlColor,
  getSelectionControlIOSColor,
} from '../../Checkbox/utils';

describe('getAndroidSelectionControlColor - ripple color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurface)
        .alpha(0.16)
        .rgb()
        .string(),
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.text)
        .alpha(0.16)
        .rgb()
        .string(),
    });
  });

  it('should return custom color', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        customColor: 'purple',
      })
    ).toMatchObject({
      rippleColor: color('purple').fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.primary).fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.accent)
        .fade(0.32)
        .rgb()
        .string(),
    });
  });
});

describe('getAndroidSelectionControlColor - checkbox color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false, false).colors.text,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: true,
        customColor: 'purple',
      })
    ).toMatchObject({
      selectionControlColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, checked', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.primary,
    });
  });

  it('should return theme color, for theme version 2, checked', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false, false),
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false, false).colors.accent,
    });
  });

  it('should return custom color, unchecked', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: false,
        customUncheckedColor: 'purple',
      })
    ).toMatchObject({
      selectionControlColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, unchecked', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme color, for theme version 2, unchecked, dark mode', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(true, false),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: color(getTheme(true, false).colors.text)
        .alpha(0.7)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, unchecked, light mode', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false, false),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: color(getTheme(false, false).colors.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });
});

describe('getSelectionControlIOSColor - ripple color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurface)
        .alpha(0.16)
        .rgb()
        .string(),
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.text)
        .alpha(0.16)
        .rgb()
        .string(),
    });
  });

  it('should return custom color', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        customColor: 'purple',
      })
    ).toMatchObject({
      rippleColor: color('purple').fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.primary).fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.accent)
        .fade(0.32)
        .rgb()
        .string(),
    });
  });
});

describe('getSelectionControlIOSColor - checked color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      checkedColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        checked: true,
        customColor: 'purple',
      })
    ).toMatchObject({
      checkedColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        checked: true,
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.primary,
    });
  });

  it('should return theme color, for theme version 2, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(false, false),
        checked: true,
      })
    ).toMatchObject({
      checkedColor: getTheme(false, false).colors.accent,
    });
  });
});
