import { createContext, useContext } from 'react';
import { Platform } from 'react-native';

type Direction = 'rtl' | 'ltr';

const defaultDirection: Direction = 'ltr';
const context = createContext<Direction>(defaultDirection);
const isWeb = Platform.OS === 'web';

const useLocale = () => {
  const direction = useContext(context);
  const localeProps = direction === 'rtl' ? { dir: 'rtl' } : {};

  // Since I18nManager is mocked in react-native-web (https://github.com/necolas/react-native-web/releases/tag/0.18.0)
  // we have to rely on default react-native-web positioning for RTL languages.
  // Most of the time this works out of the box, but in few specific cases
  // we need to overwrite right/left ourselves.
  const overwriteRTL = isWeb && direction === 'rtl';

  return {
    direction,
    localeProps,
    overwriteRTL,
  };
};

export const { Provider: LocalizationProvider } = context;

export { Direction, useLocale };
