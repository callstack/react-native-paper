// @ts-nocheck
import * as React from 'react';
import { AccessibilityInfo } from 'react-native';
import { ThemeProvider } from './theming';
import { Provider as SettingsProvider, Settings } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { Theme } from '../types';

type Props = {
  children: React.ReactNode;
  theme?: Theme;
  settings?: Settings;
};
export default class Provider extends React.Component<Props> {
  state = {
    reduceMotionEnabled: false,
  };

  componentDidMount() {
    AccessibilityInfo.addEventListener(
      'reduceMotionEnabled',
      this._handleReduceMotionToggled
    );

    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduceMotionEnabled: boolean) => {
        const { scale } = this.props.settings;
        this.setState({ reduceMotionEnabled });
        return (scale.value = 0);
      })
      .catch(e => console.log(e));
  }

  componentWillUnmount() {
    AccessibilityInfo.removeEventListener(
      'reduceMotionEnabled',
      this._handleReduceMotionToggled
    );
  }

  _handleReduceMotionToggled = (reduceMotionEnabled: any) => {
    this.setState({ reduceMotionEnabled });
  };

  render() {
    return (
      <PortalHost>
        <SettingsProvider
          value={this.props.settings || { icon: MaterialCommunityIcon }}
        >
          <ThemeProvider theme={this.props.theme}>
            {this.props.children}
          </ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    );
  }
}
