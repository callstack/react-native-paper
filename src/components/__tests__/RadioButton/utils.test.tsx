import { describe, expect, it } from '@jest/globals';

import { DarkTheme, LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import { getSelectionControlColor } from '../../RadioButton/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('getSelectionControlColor', () => {
  it('should return disabled color', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
        disabled: true,
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: LightTheme.colors.onSurface,
      selectionControlOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
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
        theme: LightTheme,
        checked: true,
      })
    ).toMatchObject({
      selectionControlColor: LightTheme.colors.primary,
    });
  });

  it('should return onSurfaceVariant color, unchecked', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
        checked: false,
      })
    ).toMatchObject({
      selectionControlColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return error color when error is true, checked', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
        checked: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: LightTheme.colors.error,
    });
  });

  it('should return error color when error is true, unchecked', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
        checked: false,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: LightTheme.colors.error,
    });
  });

  it('should return error color, dark mode, when error is true', () => {
    expect(
      getSelectionControlColor({
        theme: DarkTheme,
        checked: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: DarkTheme.colors.error,
    });
  });

  it('should return disabled color when both disabled and error are true (disabled wins)', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
        checked: true,
        disabled: true,
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: LightTheme.colors.onSurface,
      selectionControlOpacity: stateOpacity.disabled,
    });
  });

  it('should return custom color when both customColor and error are true (customColor wins)', () => {
    expect(
      getSelectionControlColor({
        theme: LightTheme,
        checked: true,
        customColor: 'purple',
        error: true,
      })
    ).toMatchObject({
      selectionControlColor: 'purple',
    });
  });
});
