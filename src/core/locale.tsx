import * as React from 'react';
import { I18nManager, Platform, StyleSheet, View } from 'react-native';

/**
 * Writing direction of the app.
 * Use this to override RTL/LTR on platforms where `I18nManager` is a no-op (e.g. React Native Web).
 */
export type Direction = 'ltr' | 'rtl';

export type LocaleContextValue = {
  direction: Direction;
};

export const LocaleContext = React.createContext<LocaleContextValue | null>(
  null
);

/**
 * Whether the nearest direction comes from a `LocaleProvider`, which also sets
 * the layout direction of its subtree on web. `Portal` reads it to carry that
 * layout direction to the portal host.
 */
export const SubtreeDirectionContext = React.createContext(false);

export type LocaleProviderProps = {
  direction: Direction;
  children: React.ReactNode;
};

type DirectionProviderProps = LocaleProviderProps & {
  /**
   * Whether to lay the children out in `direction` on web. `PaperProvider`
   * leaves the layout direction of the whole app to the page (`<html dir>`).
   */
  setsLayout?: boolean;
};

/**
 * Provides the direction to Paper's components.
 */
export function DirectionProvider({
  direction,
  setsLayout = false,
  children,
}: DirectionProviderProps) {
  const value = React.useMemo(() => ({ direction }), [direction]);
  return (
    <LocaleContext.Provider value={value}>
      <SubtreeDirectionContext.Provider value={setsLayout}>
        {Platform.OS === 'web' && setsLayout ? (
          // react-native-web reads `dir` for `start` and `end` styles, and the
          // browser for rows and text. `display: contents` keeps the wrapper
          // out of the layout.
          <View
            // @ts-expect-error: `ViewProps` doesn't expose the web-specific `dir` prop.
            dir={direction}
            style={styles.contents}
          >
            {children}
          </View>
        ) : (
          children
        )}
      </SubtreeDirectionContext.Provider>
    </LocaleContext.Provider>
  );
}

/**
 * Overrides the direction for a part of the tree. On web it also lays that
 * part out in the direction, including content it opens in a `Portal`.
 */
export function LocaleProvider({ direction, children }: LocaleProviderProps) {
  return (
    <DirectionProvider direction={direction} setsLayout>
      {children}
    </DirectionProvider>
  );
}

/**
 * Returns the locale context value. Must be used inside a `PaperProvider` (or `LocaleProvider`).
 */
export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext);
  if (context === null) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export const getDefaultDirection = (): Direction =>
  I18nManager.getConstants?.().isRTL ? 'rtl' : 'ltr';

const styles = StyleSheet.create({
  contents: {
    display: 'contents',
  },
});
