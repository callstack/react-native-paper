import { getTheme } from '../../../core/theming';
import { tokens } from '../../../theme/tokens';
import { getSelectionControlColor } from '../../Checkbox/utils';
const { stateOpacity } = tokens.md.ref;

describe('getSelectionControlColor - checkbox color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getSelectionControlColor({
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
      getSelectionControlColor({
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
      getSelectionControlColor({
        theme: getTheme(),
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.primary,
    });
  });

  it('should return custom color, unchecked', () => {
    expect(
      getSelectionControlColor({
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
      getSelectionControlColor({
        theme: getTheme(),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme color, unchecked, dark mode', () => {
    expect(
      getSelectionControlColor({
        theme: getTheme(true),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(true).colors.onSurfaceVariant,
    });
  });

  it('should return theme color, unchecked, light mode', () => {
    expect(
      getSelectionControlColor({
        theme: getTheme(false),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme(false).colors.onSurfaceVariant,
    });
  });

  it('should return error color, checked, when error is true', () => {
    expect(
      getSelectionControlColor({
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
      getSelectionControlColor({
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
      getSelectionControlColor({
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
      getSelectionControlColor({
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
      getSelectionControlColor({
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
      getSelectionControlColor({
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
