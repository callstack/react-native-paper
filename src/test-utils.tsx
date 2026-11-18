import * as React from 'react';

import { render, type RenderOptions } from '@testing-library/react-native';

import MaterialCommunityIcon from './components/MaterialCommunityIcon';
import { getDefaultDirection, LocaleProvider } from './core/locale';
import { Provider as SettingsProvider } from './core/settings';
import { ThemeProvider } from './core/theming';
import { LightTheme } from './theme/schemes';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider
    value={{ icon: MaterialCommunityIcon, rippleEffectEnabled: true }}
  >
    <LocaleProvider direction={getDefaultDirection()}>
      <ThemeProvider theme={LightTheme}>{children}</ThemeProvider>
    </LocaleProvider>
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

export * from '@testing-library/react-native';
export { customRender as render };
