import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../../core/theming';
import { tokens } from '../../../theme/tokens';
import { getSelectionControlIOSColor } from '../../RadioButton/utils';

const stateOpacity = tokens.md.sys.state.opacity;

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
