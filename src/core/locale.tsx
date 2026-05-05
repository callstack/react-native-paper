import * as React from 'react';
import { I18nManager } from 'react-native';

/**
 * Writing direction of the app. Defaults to the value from `I18nManager`.
 * Use this to override RTL/LTR on platforms where `I18nManager` is a no-op (e.g. React Native Web).
 */
export type Direction = 'ltr' | 'rtl';

export type LocaleContextValue = {
  direction: Direction;
};

export const getDefaultDirection = (): Direction =>
  I18nManager.getConstants?.().isRTL ? 'rtl' : 'ltr';

export const LocaleContext = React.createContext<LocaleContextValue>({
  direction: getDefaultDirection(),
});

export const { Provider: LocaleProvider } = LocaleContext;

export const useLocale = () => React.useContext(LocaleContext);
