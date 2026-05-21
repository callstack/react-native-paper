import * as React from 'react';

import { render, type RenderOptions } from '@testing-library/react-native';

import MaterialCommunityIcon from './components/MaterialCommunityIcon';
import { getDefaultDirection, LocaleProvider } from './core/locale';
import { Provider as SettingsProvider } from './core/settings';
import { defaultThemes, ThemeProvider } from './core/theming';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider
    value={{ icon: MaterialCommunityIcon, rippleEffectEnabled: true }}
  >
    <LocaleProvider direction={getDefaultDirection()}>
      <ThemeProvider theme={defaultThemes.light}>{children}</ThemeProvider>
    </LocaleProvider>
  </SettingsProvider>
);

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
