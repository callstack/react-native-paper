import { describe, expect, it } from '@jest/globals';

import { DarkTheme, LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import { getSelectionControlIOSColor } from '../../RadioButton/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('getSelectionControlIOSColor - checked color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getSelectionControlIOSColor({
        theme: LightTheme,
        disabled: true,
      })
    ).toMatchObject({
      checkedColor: LightTheme.colors.primary,
      checkedColorOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: LightTheme,
        customColor: 'purple',
      })
    ).toMatchObject({
      checkedColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, checked', () => {
    expect(
      getSelectionControlIOSColor({
        theme: LightTheme,
      })
    ).toMatchObject({
      checkedColor: LightTheme.colors.primary,
    });
  });

  it('should return error color when error is true', () => {
    expect(
      getSelectionControlIOSColor({
        theme: LightTheme,
        error: true,
      })
    ).toMatchObject({
      checkedColor: LightTheme.colors.error,
    });
  });

  it('should return error color, dark mode, when error is true', () => {
    expect(
      getSelectionControlIOSColor({
        theme: DarkTheme,
        error: true,
      })
    ).toMatchObject({
      checkedColor: DarkTheme.colors.error,
    });
  });

  it('should return disabled color when both disabled and error are true (disabled wins)', () => {
    expect(
      getSelectionControlIOSColor({
        theme: LightTheme,
        disabled: true,
        error: true,
      })
    ).toMatchObject({
      checkedColor: LightTheme.colors.primary,
      checkedColorOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color when both customColor and error are true (customColor wins)', () => {
    expect(
      getSelectionControlIOSColor({
        theme: LightTheme,
        customColor: 'purple',
        error: true,
      })
    ).toMatchObject({
      checkedColor: 'purple',
    });
  });
});
