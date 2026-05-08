import * as React from 'react';
import { I18nManager } from 'react-native';

/**
 * Writing direction of the app.
 * Use this to override RTL/LTR on platforms where `I18nManager` is a no-op (e.g. React Native Web).
 */
export type Direction = 'ltr' | 'rtl';

export type LocaleContextValue = {
  direction: Direction;
};

export const LocaleContext = React.createContext<LocaleContextValue>({
  direction: I18nManager.getConstants?.().isRTL ? 'rtl' : 'ltr',
});

export type LocaleProviderProps = {
  direction: Direction;
  children: React.ReactNode;
};

/**
 * Provider component for locale configuration.
 */
export function LocaleProvider({ direction, children }: LocaleProviderProps) {
  const value = React.useMemo(() => ({ direction }), [direction]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Returns the locale context value. Must be used inside a `PaperProvider` (or `LocaleProvider`).
 * Falls back to the system direction from `I18nManager` when used outside a provider.
 */
export function useLocale(): LocaleContextValue {
  return React.useContext(LocaleContext);
}

export const getDefaultDirection = (): Direction =>
  I18nManager.getConstants?.().isRTL ? 'rtl' : 'ltr';
