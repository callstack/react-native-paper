import {
  getButtonThemeV3,
  getButtonThemeV2,
} from '../../core/themes-builder/button-builder/buttonThemeBuilder';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

type UseButtonThemeProp = {
  theme?: ThemeProp;
};

export const useButtonTheme = ({
  theme: themeOverrides,
}: Readonly<UseButtonThemeProp>) => {
  const theme = useInternalTheme(themeOverrides);

  if (theme.isV3) {
    return getButtonThemeV3(theme);
  }
  return getButtonThemeV2(theme);
};
