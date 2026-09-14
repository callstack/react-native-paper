import { describe, expect, it } from '@jest/globals';

import { DarkTheme, LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import { getSelectionVisualState, getStateLayer } from '../../Checkbox/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('getSelectionVisualState', () => {
  describe('containerColor (the fill)', () => {
    it('uses theme.colors.primary when selected (default)', () => {
      expect(
        getSelectionVisualState({ theme: LightTheme, selected: true })
      ).toMatchObject({
        containerColor: LightTheme.colors.primary,
      });
    });

    it('uses theme.colors.error when selected + error', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: true,
          error: true,
        })
      ).toMatchObject({ containerColor: LightTheme.colors.error });
    });

    it('uses customColor when provided (overrides error)', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: true,
          error: true,
          customColor: 'purple',
        })
      ).toMatchObject({ containerColor: 'purple' });
    });

    it('falls back to onSurface when disabled (overrides customColor)', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: true,
          disabled: true,
          customColor: 'purple',
        })
      ).toMatchObject({ containerColor: LightTheme.colors.onSurface });
    });
  });

  describe('outlineColor (unselected border)', () => {
    it('uses theme.colors.onSurfaceVariant by default', () => {
      expect(
        getSelectionVisualState({ theme: LightTheme, selected: false })
      ).toMatchObject({ outlineColor: LightTheme.colors.onSurfaceVariant });
    });

    it('uses theme.colors.error when error', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: false,
          error: true,
        })
      ).toMatchObject({ outlineColor: LightTheme.colors.error });
    });

    it('uses customUncheckedColor when provided (overrides error)', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: false,
          error: true,
          customUncheckedColor: 'orange',
        })
      ).toMatchObject({ outlineColor: 'orange' });
    });

    it('falls back to onSurface when disabled', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: false,
          disabled: true,
          customUncheckedColor: 'orange',
        })
      ).toMatchObject({ outlineColor: LightTheme.colors.onSurface });
    });
  });

  describe('iconColor (checkmark / dash glyph)', () => {
    it('keeps its color when unselected while the mask hides it', () => {
      expect(
        getSelectionVisualState({ theme: LightTheme, selected: false })
      ).toMatchObject({ iconColor: LightTheme.colors.onPrimary });
    });

    it('uses theme.colors.onPrimary when selected (default)', () => {
      expect(
        getSelectionVisualState({ theme: LightTheme, selected: true })
      ).toMatchObject({
        iconColor: LightTheme.colors.onPrimary,
      });
    });

    it('uses theme.colors.onError when selected + error', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: true,
          error: true,
        })
      ).toMatchObject({ iconColor: LightTheme.colors.onError });
    });

    it('uses theme.colors.surface when selected + disabled', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: true,
          disabled: true,
        })
      ).toMatchObject({ iconColor: LightTheme.colors.surface });
    });
  });

  describe('containerOpacity', () => {
    it('is the enabled state opacity by default', () => {
      expect(
        getSelectionVisualState({ theme: LightTheme, selected: true })
      ).toMatchObject({
        containerOpacity: stateOpacity.enabled,
      });
    });

    it('drops to the disabled state opacity when disabled', () => {
      expect(
        getSelectionVisualState({
          theme: LightTheme,
          selected: true,
          disabled: true,
        })
      ).toMatchObject({ containerOpacity: stateOpacity.disabled });
    });
  });

  describe('dark theme', () => {
    it('respects the dark theme palette', () => {
      const v = getSelectionVisualState({ theme: DarkTheme, selected: true });
      expect(v.containerColor).toBe(DarkTheme.colors.primary);
      expect(v.iconColor).toBe(DarkTheme.colors.onPrimary);
    });
  });
});

describe('getStateLayer', () => {
  const { colors } = theme;
  const { hovered, focused, pressed } = tokens.md.sys.state.opacity;

  it('is fully transparent when idle', () => {
    expect(
      getStateLayer({ theme, selected: false, interaction: null })
    ).toEqual({ color: 'transparent', opacity: 0 });
  });

  it.each([
    ['hovered' as const, hovered],
    ['focused' as const, focused],
  ])('tints %s with primary when selected', (interaction, opacity) => {
    expect(getStateLayer({ theme, selected: true, interaction })).toEqual({
      color: colors.primary,
      opacity,
    });
  });

  it.each([
    ['hovered' as const, hovered],
    ['focused' as const, focused],
  ])('tints %s with onSurface when unselected', (interaction, opacity) => {
    expect(getStateLayer({ theme, selected: false, interaction })).toEqual({
      color: colors.onSurface,
      opacity,
    });
  });

  it('inverts to onSurface when a selected checkbox is pressed', () => {
    expect(
      getStateLayer({ theme, selected: true, interaction: 'pressed' })
    ).toEqual({ color: colors.onSurface, opacity: pressed });
  });

  it('inverts to primary when an unselected checkbox is pressed', () => {
    expect(
      getStateLayer({ theme, selected: false, interaction: 'pressed' })
    ).toEqual({ color: colors.primary, opacity: pressed });
  });

  it.each(['hovered' as const, 'focused' as const, 'pressed' as const])(
    'stays on error for %s regardless of selection',
    (interaction) => {
      expect(
        getStateLayer({ theme, selected: true, error: true, interaction })
      ).toEqual({ color: colors.error, opacity: expect.any(Number) });
      expect(
        getStateLayer({ theme, selected: false, error: true, interaction })
      ).toEqual({ color: colors.error, opacity: expect.any(Number) });
    }
  );

  describe('custom colors', () => {
    const custom = {
      customColor: 'rebeccapurple',
      customUncheckedColor: 'teal',
    };

    it.each([
      ['hovered' as const, hovered],
      ['focused' as const, focused],
    ])('uses customColor for %s when selected', (interaction, opacity) => {
      expect(
        getStateLayer({ theme, selected: true, interaction, ...custom })
      ).toEqual({ color: 'rebeccapurple', opacity });
    });

    it.each([
      ['hovered' as const, hovered],
      ['focused' as const, focused],
    ])(
      'uses customUncheckedColor for %s when unselected',
      (interaction, opacity) => {
        expect(
          getStateLayer({ theme, selected: false, interaction, ...custom })
        ).toEqual({ color: 'teal', opacity });
      }
    );

    it('takes the unchecked color when a selected checkbox is pressed', () => {
      expect(
        getStateLayer({
          theme,
          selected: true,
          interaction: 'pressed',
          ...custom,
        })
      ).toEqual({ color: 'teal', opacity: pressed });
    });

    it('takes the checked color when an unselected checkbox is pressed', () => {
      expect(
        getStateLayer({
          theme,
          selected: false,
          interaction: 'pressed',
          ...custom,
        })
      ).toEqual({ color: 'rebeccapurple', opacity: pressed });
    });

    it('overrides error, matching the box', () => {
      expect(
        getStateLayer({
          theme,
          selected: true,
          error: true,
          interaction: 'hovered',
          ...custom,
        })
      ).toEqual({ color: 'rebeccapurple', opacity: hovered });
    });

    it('leaves the other side on its token role', () => {
      expect(
        getStateLayer({
          theme,
          selected: true,
          interaction: 'hovered',
          customUncheckedColor: 'teal',
        })
      ).toEqual({ color: colors.primary, opacity: hovered });
    });
  });
});
