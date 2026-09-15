import { Platform, StyleSheet } from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { getTheme } from '../../core/theming';
import { act } from '../../test-utils';
import { useTextInput } from '../TextInput/hooks';

const theme = getTheme();
afterEach(() => {
  jest.restoreAllMocks();
});

it.each(['filled', 'outlined'] as const)(
  'applies disabled opacity once to %s text and affixes',
  async (variant) => {
    const { result } = await renderHook(
      () =>
        useTextInput({
          variant,
          disabled: true,
          value: 'Sample',
          prefix: '$',
          suffix: '/100',
        }),
      { wrapper: PaperProvider }
    );
    const containerOpacity =
      StyleSheet.flatten(result.current.containerStyles)?.opacity ?? 1;
    expect(containerOpacity).toBe(1);
    for (const styles of [
      result.current.inputStyles,
      result.current.prefixStyles,
      result.current.suffixStyles,
    ]) {
      expect(StyleSheet.flatten(styles)?.opacity).toBe(0.38);
    }
  }
);

it('uses MD3 filled resting and hover colors without overriding the focused or disabled indicator', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const { result, rerender } = await renderHook(
    (props: { error?: boolean; disabled?: boolean }) => useTextInput(props),
    { initialProps: {}, wrapper: PaperProvider }
  );
  expect(
    StyleSheet.flatten(result.current.outlineStyles)?.backgroundColor
  ).toBe(theme.colors.onSurfaceVariant);
  await act(() => result.current.onHoverIn());
  expect(
    StyleSheet.flatten(result.current.outlineStyles)?.backgroundColor
  ).toBe(theme.colors.onSurface);
  expect(
    StyleSheet.flatten(result.current.animatedActiveOutlineStyles)
  ).toMatchObject({ backgroundColor: theme.colors.primary });
  await rerender({ error: true });
  expect(
    StyleSheet.flatten(result.current.outlineStyles)?.backgroundColor
  ).toBe(theme.colors.onErrorContainer);
  expect(
    StyleSheet.flatten(result.current.animatedActiveOutlineStyles)
  ).toMatchObject({ backgroundColor: theme.colors.error });
  await act(() => result.current.onHoverOut());
  expect(
    StyleSheet.flatten(result.current.outlineStyles)?.backgroundColor
  ).toBe(theme.colors.error);
  await act(() => result.current.onHoverIn());
  await rerender({ error: true, disabled: true });
  expect(
    StyleSheet.flatten(result.current.outlineStyles)?.backgroundColor
  ).toBe(theme.colors.onSurface);
  await act(() => result.current.onHoverOut());
  await rerender({});
  expect(
    StyleSheet.flatten(result.current.outlineStyles)?.backgroundColor
  ).toBe(theme.colors.onSurfaceVariant);
});

it('preserves the outlined resting color on hover', async () => {
  const { result } = await renderHook(
    () => useTextInput({ variant: 'outlined' }),
    { wrapper: PaperProvider }
  );
  await act(() => result.current.onHoverIn());
  expect(StyleSheet.flatten(result.current.outlineStyles)?.borderColor).toBe(
    theme.colors.outline
  );
});
