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

type State = {
  colorScheme: ColorSchemeName;
  reduceMotionEnabled: boolean;
};

export default class Provider extends React.Component<Props, State> {
  state = {
    reduceMotionEnabled: false,
    colorScheme: Appearance?.getColorScheme() || 'light',
  };

  async componentDidMount() {
    AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      this.updateReduceMotionSettingsInfo
    );
    this.updateReduceMotionSettingsInfo();
    Appearance?.addChangeListener(this.handleAppearanceChange);
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener(
      'reduceMotionChanged',
      this.updateReduceMotionSettingsInfo
    );
    Appearance?.removeChangeListener(this.handleAppearanceChange);
  }

  private handleAppearanceChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    const { colorScheme } = preferences;
    this.setState({ colorScheme });
  };

  private getTheme = () => {
    const { theme: providedTheme } = this.props;
    const { reduceMotionEnabled, colorScheme } = this.state;

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

  private updateReduceMotionSettingsInfo = async () => {
    try {
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

      this.setState({ reduceMotionEnabled });
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    const { children, settings } = this.props;

    return (
      <PortalHost>
        <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
          <ThemeProvider theme={this.getTheme()}>{children}</ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    );
  }
}
