import { getTheme } from '../../../core/theming';
import { tokens } from '../../../theme/tokens';
import { getSelectionVisualState } from '../../Checkbox/utils';

const stateOpacity = tokens.md.sys.state.opacity;
const theme = getTheme();
const darkTheme = getTheme(true);

describe('getSelectionVisualState', () => {
  describe('containerColor (the fill)', () => {
    it('uses theme.colors.primary when selected (default)', () => {
      expect(getSelectionVisualState({ theme, selected: true })).toMatchObject({
        containerColor: theme.colors.primary,
      });
    });

    it('uses theme.colors.error when selected + error', () => {
      expect(
        getSelectionVisualState({ theme, selected: true, error: true })
      ).toMatchObject({ containerColor: theme.colors.error });
    });

    it('uses customColor when provided (overrides error)', () => {
      expect(
        getSelectionVisualState({
          theme,
          selected: true,
          error: true,
          customColor: 'purple',
        })
      ).toMatchObject({ containerColor: 'purple' });
    });

    it('falls back to onSurface when disabled (overrides customColor)', () => {
      expect(
        getSelectionVisualState({
          theme,
          selected: true,
          disabled: true,
          customColor: 'purple',
        })
      ).toMatchObject({ containerColor: theme.colors.onSurface });
    });
  });

  describe('outlineColor (unselected border)', () => {
    it('uses theme.colors.onSurfaceVariant by default', () => {
      expect(getSelectionVisualState({ theme, selected: false })).toMatchObject(
        { outlineColor: theme.colors.onSurfaceVariant }
      );
    });

    it('uses theme.colors.error when error', () => {
      expect(
        getSelectionVisualState({ theme, selected: false, error: true })
      ).toMatchObject({ outlineColor: theme.colors.error });
    });

    it('uses customUncheckedColor when provided (overrides error)', () => {
      expect(
        getSelectionVisualState({
          theme,
          selected: false,
          error: true,
          customUncheckedColor: 'orange',
        })
      ).toMatchObject({ outlineColor: 'orange' });
    });

    it('falls back to onSurface when disabled', () => {
      expect(
        getSelectionVisualState({
          theme,
          selected: false,
          disabled: true,
          customUncheckedColor: 'orange',
        })
      ).toMatchObject({ outlineColor: theme.colors.onSurface });
    });
  });

  describe('iconColor (checkmark / dash glyph)', () => {
    it('is transparent when unselected (no glyph drawn)', () => {
      expect(getSelectionVisualState({ theme, selected: false })).toMatchObject(
        { iconColor: 'transparent' }
      );
    });

    it('uses theme.colors.onPrimary when selected (default)', () => {
      expect(getSelectionVisualState({ theme, selected: true })).toMatchObject({
        iconColor: theme.colors.onPrimary,
      });
    });

    it('uses theme.colors.onError when selected + error', () => {
      expect(
        getSelectionVisualState({ theme, selected: true, error: true })
      ).toMatchObject({ iconColor: theme.colors.onError });
    });

    it('uses theme.colors.surface when selected + disabled', () => {
      expect(
        getSelectionVisualState({ theme, selected: true, disabled: true })
      ).toMatchObject({ iconColor: theme.colors.surface });
    });
  });

  describe('containerOpacity', () => {
    it('is the enabled state opacity by default', () => {
      expect(getSelectionVisualState({ theme, selected: true })).toMatchObject({
        containerOpacity: stateOpacity.enabled,
      });
    });

    it('drops to the disabled state opacity when disabled', () => {
      expect(
        getSelectionVisualState({ theme, selected: true, disabled: true })
      ).toMatchObject({ containerOpacity: stateOpacity.disabled });
    });
  });

  describe('dark theme', () => {
    it('respects the dark theme palette', () => {
      const v = getSelectionVisualState({ theme: darkTheme, selected: true });
      expect(v.containerColor).toBe(darkTheme.colors.primary);
      expect(v.iconColor).toBe(darkTheme.colors.onPrimary);
    });
  });
});
