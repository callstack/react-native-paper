import * as React from 'react';
import { AccessibilityInfo, Appearance, ColorSchemeName } from 'react-native';
import { ThemeProvider } from './theming';
import { Provider as SettingsProvider, Settings } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import DefaultTheme from '../styles/DefaultTheme';
import DarkTheme from '../styles/DarkTheme';

type Props = {
  children: React.ReactNode;
  theme?: ReactNativePaper.Theme;
  settings?: Settings;
};

const Provider = ({ ...props }: Props) => {
  const colorSchemeName =
    (!props.theme && Appearance?.getColorScheme()) || 'light';

  const [reduceMotionEnabled, setreduceMotionEnabled] = React.useState<boolean>(
    false
  );
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(
    colorSchemeName
  );

  const handleAppearanceChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    const { colorScheme } = preferences;
    setColorScheme(colorScheme);
  };

  const updateReduceMotionSettingsInfo = async () => {
    try {
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      if (reduceMotionEnabled) {
        setreduceMotionEnabled(reduceMotionEnabled);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      updateReduceMotionSettingsInfo
    );

    updateReduceMotionSettingsInfo();

    return () => {
      AccessibilityInfo.removeEventListener(
        'reduceMotionChanged',
        updateReduceMotionSettingsInfo
      );
    };
  }, []);

  React.useEffect(() => {
    if (!props.theme) Appearance?.addChangeListener(handleAppearanceChange);
    return () => {
      if (!props.theme)
        Appearance?.removeChangeListener(handleAppearanceChange);
    };
  }, [props.theme]);

  const getTheme = () => {
    const { theme: providedTheme } = props;

    if (providedTheme) {
      return providedTheme;
    } else {
      const theme = (colorScheme === 'dark'
        ? DarkTheme
        : DefaultTheme) as ReactNativePaper.Theme;

      return {
        ...theme,
        animation: {
          ...theme.animation,
          scale: reduceMotionEnabled ? 0 : 1,
        },
      };
    }
  };

  const { children, settings } = props;
  return (
    <PortalHost>
      <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
        <ThemeProvider theme={getTheme()}>{children}</ThemeProvider>
      </SettingsProvider>
    </PortalHost>
  );
};

export default Provider;
