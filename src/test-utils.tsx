import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  render,
  screen,
  type RenderOptions,
} from '@testing-library/react-native';

import MaterialCommunityIcon from './components/MaterialCommunityIcon';
import { DirectionProvider, getDefaultDirection } from './core/locale';
import { Provider as SettingsProvider } from './core/settings';
import { ThemeProvider } from './core/theming';
import { LightTheme } from './theme/schemes';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider
    value={{ icon: MaterialCommunityIcon, rippleEffectEnabled: true }}
  >
    <DirectionProvider direction={getDefaultDirection()}>
      <ThemeProvider theme={LightTheme}>{children}</ThemeProvider>
    </DirectionProvider>
  </SettingsProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

/**
 * A focus or blur event that the element fired itself, for `fireEvent`. Native
 * focus events bubble, and the focus ring ignores one whose `target` isn't the
 * element it is attached to, so the event needs a matching pair.
 */
export const ownFocusEvent = () => {
  const node = {};
  return { nativeEvent: { target: 0 }, target: node, currentTarget: node };
};

/**
 * The CSS transition on an element. Reanimated's Jest setup keeps CSS
 * transitions out of `style`, in `jestInlineStyle`.
 */
export const transitionOf = (
  element: ReturnType<typeof screen.getByTestId> | null
) => {
  const { transitionDuration, transitionTimingFunction } =
    // eslint-disable-next-line no-restricted-properties -- test-only read of a plain style.
    StyleSheet.flatten(element?.props.jestInlineStyle) ?? {};
  return { transitionDuration, transitionTimingFunction };
};

export * from '@testing-library/react-native';
export { customRender as render };
