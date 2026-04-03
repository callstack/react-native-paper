import { getTheme } from '../../../core/theming';
import {
  getAndroidSelectionControlColor,
  getSelectionControlIOSColor,
} from '../../Checkbox/utils';

describe('getAndroidSelectionControlColor - checkbox color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurface,
      selectionControlOpacity: 0.38,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false).colors.onSurface,
      selectionControlOpacity: 0.38,
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
        theme: getTheme(false),
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false).colors.primary,
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
        theme: getTheme(true),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(true).colors.onSurfaceVariant,
    });
  });

  it('should return theme color, for theme version 2, unchecked, light mode', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false).colors.onSurfaceVariant,
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
      checkedColor: getTheme().colors.primary,
      checkedColorOpacity: 0.38,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(false),
        disabled: true,
      })
    ).toMatchObject({
      checkedColor: getTheme(false).colors.primary,
      checkedColorOpacity: 0.38,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
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
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.primary,
    });
  });

  it('should return theme color, for theme version 2, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(false),
      })
    ).toMatchObject({
      checkedColor: getTheme(false).colors.primary,
    });
  });
});
