import { createContext, useContext } from 'react';
import { Platform } from 'react-native';

type Direction = 'rtl' | 'ltr';

// type LocaleDirectionComponent<Props> = React.ComponentType<
//   Omit<Props, 'direction'>
// >;

const defaultDirection: Direction = 'ltr';
const context = createContext<Direction>(defaultDirection);

const useLocaleDirection = (): Direction => {
  return useContext(context);
};

// const withLocaleDirection = <Props extends Record<string, any>>(
//   WrappedComponent: React.ComponentType<Props>
// ): LocaleDirectionComponent<Props> => {
//   const displayName =
//     WrappedComponent.displayName || WrappedComponent.name || 'Component';
//
//   const Component = (props: Props) => {
//     const direction = useLocaleDirection();
//
//     return <WrappedComponent {...props} direction={direction} />;
//   };
//
//   Component.displayName = `withLocaleDirection(${displayName})`;
//
//   return Component as LocaleDirectionComponent<Props>;
// };

const isWeb = Platform.OS === 'web';

// Since I18nManager is mocked in react-native-web (https://github.com/necolas/react-native-web/releases/tag/0.18.0)
// we have to rely on default react-native-web positioning for RTL languages.
// Most of the time this works out of the box, but in few specific cases
// we need to overwrite right/left ourselves.

const useRTLOverwrite = () => {
  const direction = useLocaleDirection();
  return isWeb && direction === 'rtl';
};

export const { Provider: LocalizationProvider } = context;

export { Direction, useLocaleDirection, useRTLOverwrite };
