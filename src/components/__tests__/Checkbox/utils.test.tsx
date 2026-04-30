import { getTheme } from '../../../core/theming';
import { tokens } from '../../../styles/themes/tokens';
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
});
