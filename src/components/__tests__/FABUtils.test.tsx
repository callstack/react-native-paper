import { getTheme } from '../../core/theming';
import { getDimensions, resolveColors } from '../FAB/utils';

describe('resolveColors', () => {
  it('returns theme colors for default variant (tonalPrimary)', () => {
    const theme = getTheme();
    const colors = resolveColors({ theme });
    expect(colors).toEqual({
      container: theme.colors.primaryContainer,
      content: theme.colors.onPrimaryContainer,
    });
  });

  it('returns theme colors for primary variant', () => {
    const theme = getTheme();
    const colors = resolveColors({ theme, variant: 'primary' });
    expect(colors).toEqual({
      container: theme.colors.primary,
      content: theme.colors.onPrimary,
    });
  });

  it('returns theme colors for secondary variant', () => {
    const theme = getTheme();
    const colors = resolveColors({ theme, variant: 'secondary' });
    expect(colors).toEqual({
      container: theme.colors.secondary,
      content: theme.colors.onSecondary,
    });
  });

  it('returns theme colors for tertiary variant', () => {
    const theme = getTheme();
    const colors = resolveColors({ theme, variant: 'tertiary' });
    expect(colors).toEqual({
      container: theme.colors.tertiary,
      content: theme.colors.onTertiary,
    });
  });

  it('returns theme colors for tonalSecondary variant', () => {
    const theme = getTheme();
    const colors = resolveColors({ theme, variant: 'tonalSecondary' });
    expect(colors).toEqual({
      container: theme.colors.secondaryContainer,
      content: theme.colors.onSecondaryContainer,
    });
  });

  it('returns theme colors for tonalTertiary variant', () => {
    const theme = getTheme();
    const colors = resolveColors({ theme, variant: 'tonalTertiary' });
    expect(colors).toEqual({
      container: theme.colors.tertiaryContainer,
      content: theme.colors.onTertiaryContainer,
    });
  });

  it('containerColor override wins over variant', () => {
    const theme = getTheme();
    const colors = resolveColors({
      theme,
      variant: 'primary',
      containerColor: '#custom',
    });
    expect(colors.container).toBe('#custom');
  });

  it('derives content color from containerColor when contentColor is not set', () => {
    const theme = getTheme();
    // Use a known theme color so contentColorFor can derive the on-color pairing
    const colors = resolveColors({
      theme,
      containerColor: theme.colors.primary,
    });
    expect(colors.container).toBe(theme.colors.primary);
    expect(colors.content).toBe(theme.colors.onPrimary);
  });

  it('both containerColor and contentColor overrides win', () => {
    const theme = getTheme();
    const colors = resolveColors({
      theme,
      containerColor: '#bg',
      contentColor: '#fg',
    });
    expect(colors).toEqual({ container: '#bg', content: '#fg' });
  });

  it('contentColor-only override uses variant container', () => {
    const theme = getTheme();
    const colors = resolveColors({
      theme,
      variant: 'primary',
      contentColor: '#custom',
    });
    expect(colors.container).toBe(theme.colors.primary);
    expect(colors.content).toBe('#custom');
  });
});

describe('getDimensions', () => {
  it('returns correct dimensions for default size', () => {
    const dims = getDimensions({ theme: getTheme() });
    expect(dims.height).toBe(56);
    expect(dims.width).toBe(56);
    expect(dims.iconSize).toBe(24);
    expect(dims.leading).toBe(16);
    expect(dims.trailing).toBe(16);
    expect(dims.iconLabelGap).toBe(8);
    expect(dims.labelTypescale).toBe('titleMedium');
  });

  it('returns correct dimensions for medium size', () => {
    const dims = getDimensions({ theme: getTheme(), size: 'medium' });
    expect(dims.height).toBe(80);
    expect(dims.width).toBe(80);
    expect(dims.iconSize).toBe(28);
    expect(dims.leading).toBe(26);
    expect(dims.trailing).toBe(26);
    expect(dims.iconLabelGap).toBe(12);
    expect(dims.labelTypescale).toBe('titleLarge');
  });

  it('returns correct dimensions for large size', () => {
    const dims = getDimensions({ theme: getTheme(), size: 'large' });
    expect(dims.height).toBe(96);
    expect(dims.width).toBe(96);
    expect(dims.iconSize).toBe(36);
    expect(dims.leading).toBe(30);
    expect(dims.trailing).toBe(30);
    expect(dims.iconLabelGap).toBe(16);
    expect(dims.labelTypescale).toBe('headlineSmall');
  });

  it('shape override changes borderRadius compared to default', () => {
    const theme = getTheme();
    const defaultDims = getDimensions({ theme });
    const fullDims = getDimensions({ theme, shape: 'full' });
    expect(fullDims.borderRadius).not.toBe(defaultDims.borderRadius);
  });

  it('iconSize override wins over size spec', () => {
    const dims = getDimensions({ theme: getTheme(), iconSize: 32 });
    expect(dims.iconSize).toBe(32);
  });

  it('leading and trailing overrides win over size spec', () => {
    const dims = getDimensions({
      theme: getTheme(),
      leading: 20,
      trailing: 24,
    });
    expect(dims.leading).toBe(20);
    expect(dims.trailing).toBe(24);
  });
});
