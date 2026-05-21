import { getTheme } from '../../../core/theming';
import { tokens } from '../../../theme/tokens';
import {
  getAndroidSelectionControlColor,
  getSelectionControlIOSColor,
} from '../../Checkbox/utils';
const { stateOpacity } = tokens.md.ref;

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
      selectionControlOpacity: stateOpacity.disabled,
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

  it('should return theme color, unchecked, dark mode', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(true),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(true).colors.onSurfaceVariant,
    });
  });

  it('should return theme color, unchecked, light mode', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(false),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false).colors.onSurfaceVariant,
    });
  });

  it('should return error color, checked, when error is true', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.error,
    });
  });

  it('should return error color, unchecked, when error is true', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: false,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.error,
    });
  });

  it('should return error color, checked, dark mode, when error is true', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(true),
        checked: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(true).colors.error,
    });
  });

  it('should return disabled color when both disabled and error are true (disabled wins)', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        disabled: true,
        checked: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurface,
      selectionControlOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color when both customColor and error are true, checked (customColor wins)', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: true,
        customColor: 'purple',
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: 'purple',
    });
  });

  it('should return custom unchecked color when both customUncheckedColor and error are true, unchecked (customUncheckedColor wins)', () => {
    expect(
      getAndroidSelectionControlColor({
        theme: getTheme(),
        checked: false,
        customUncheckedColor: 'purple',
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: 'purple',
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
      checkedColorOpacity: stateOpacity.disabled,
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

  it('should return error color when error is true', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        error: true,
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.error,
    });
  });

  it('should return error color, dark mode, when error is true', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(true),
        error: true,
      })
    ).toMatchObject({
      checkedColor: getTheme(true).colors.error,
    });
  });

  it('should return disabled color when both disabled and error are true (disabled wins)', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        disabled: true,
        error: true,
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.primary,
      checkedColorOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color when both customColor and error are true (customColor wins)', () => {
    expect(
      getSelectionControlIOSColor({
        theme: getTheme(),
        customColor: 'purple',
        error: true,
      })
    ).toMatchObject({
      checkedColor: 'purple',
    });
  });
});
