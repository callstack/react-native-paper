import React, { createContext, useContext } from 'react';
import { I18nManager } from 'react-native';

type Direction = 'rtl' | 'ltr';

type LocaleDirectionComponent<Props> = React.ComponentType<
  Omit<Props, 'direction'>
>;

const context = createContext<Direction>(
  I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'
);

const useLocaleDirection = (): Direction => {
  return useContext(context);
};

const withLocaleDirection = <Props extends Record<string, any>>(
  WrappedComponent: React.ComponentType<Props>
): LocaleDirectionComponent<Props> => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const Component = (props: Props) => {
    const direction = useLocaleDirection();

    return <WrappedComponent {...props} direction={direction} />;
  };

  Component.displayName = `withLocaleDirection(${displayName})`;

  return Component as LocaleDirectionComponent<Props>;
};

export const { Provider: LocalizationProvider } = context;

export { Direction, useLocaleDirection, withLocaleDirection };
