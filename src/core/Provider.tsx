import * as React from 'react';
import { AccessibilityInfo } from 'react-native';
import { ThemeProvider } from './theming';
import { Provider as SettingsProvider, Settings } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import DefaultTheme from '../styles/DefaultTheme';

type Props = {
  children: React.ReactNode;
  theme?: ReactNativePaper.Theme;
  settings?: Settings;
};
export default class Provider extends React.Component<Props> {
  state = {
    reduceMotionEnabled: false,
  };

  async componentDidMount() {
    AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      this.updateReduceMotionSettingsInfo
    );
    this.updateReduceMotionSettingsInfo();
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener(
      'reduceMotionChanged',
      this.updateReduceMotionSettingsInfo
    );
  }

  private updateReduceMotionSettingsInfo = async () => {
    try {
      const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

      this.setState({ reduceMotionEnabled });
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    const { children, settings, theme: providedTheme } = this.props;
    const { reduceMotionEnabled } = this.state;
    const theme = !providedTheme
      ? Object.assign(DefaultTheme as ReactNativePaper.Theme, {
          animation: {
            scale: reduceMotionEnabled ? 0 : 1,
          },
        })
      : providedTheme;

    return (
      <PortalHost>
        <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    );
  }
}
