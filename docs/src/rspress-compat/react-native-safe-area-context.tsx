import * as React from 'react';

type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Metrics = {
  frame: Frame;
  insets: Insets;
};

const defaultInsets: Insets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const defaultMetrics: Metrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: defaultInsets,
};

export const initialWindowMetrics = defaultMetrics;

export const SafeAreaInsetsContext = React.createContext<Insets | null>(
  defaultInsets
);

export function SafeAreaProvider({
  children,
}: React.PropsWithChildren<{ initialMetrics?: Metrics; style?: any }>) {
  return (
    <SafeAreaInsetsContext.Provider value={defaultInsets}>
      {children}
    </SafeAreaInsetsContext.Provider>
  );
}

export function useSafeAreaInsets() {
  return React.useContext(SafeAreaInsetsContext) ?? defaultInsets;
}
