import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../../core/theming';
import { tokens } from '../../../theme/tokens';
import { getSelectionControlColor } from '../../RadioButton/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('getSelectionControlColor', () => {
  it('should return disabled color', () => {
    expect(
      getSelectionControlColor({
        theme: getTheme(),
        disabled: true,
        checked: true,
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

  it('should return primary color, checked', () => {
    expect(
      getSelectionControlColor({
        theme: getTheme(),
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.primary,
    });
  });

  it('should return onSurfaceVariant color, unchecked', () => {
    expect(
      getSelectionControlColor({
        theme: getTheme(),
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return error color when error is true, checked', () => {
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

  it('should return error color when error is true, unchecked', () => {
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

  it('should return error color, dark mode, when error is true', () => {
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
        checked: true,
        disabled: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: getTheme().colors.onSurface,
      selectionControlOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color when both customColor and error are true (customColor wins)', () => {
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
});
