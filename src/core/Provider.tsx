import * as React from 'react';
import { AccessibilityInfo } from 'react-native';
import { ThemeProvider } from './theming';
import { Provider as SettingsProvider, Settings } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { Theme } from '../types';
import DefaultTheme from '../styles/DefaultTheme';

type Props = {
  children: React.ReactNode;
  theme?: Theme;
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
    const theme = this.props.theme
      ? Object.assign(DefaultTheme, {
          animation: {
            scale: this.state.reduceMotionEnabled ? 0 : 1,
          },
        })
      : this.props.theme;

    return (
      <PortalHost>
        <SettingsProvider
          value={this.props.settings || { icon: MaterialCommunityIcon }}
        >
          <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    );
  }
}
