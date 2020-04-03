import * as React from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { ThemeProvider } from './theming';
import DefaultTheme from '../styles/DefaultTheme';
import DarkTheme from '../styles/DarkTheme';
import { Provider as SettingsProvider, Settings } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { Theme } from '../types';

type Props = {
  children: React.ReactNode;
  theme?: Theme;
  settings?: Settings;
};

type State = {
  colorScheme: ColorSchemeName;
};

export default class Provider extends React.Component<Props, State> {
  state = {
    colorScheme: Appearance.getColorScheme(),
  };

  componentDidMount() {
    Appearance.addChangeListener(this._handleAppearanceChange);
  }

  componentWillUnmount() {
    Appearance.removeChangeListener(this._handleAppearanceChange);
  }

  _handleAppearanceChange = (preferences: Appearance.AppearancePreferences) => {
    const { colorScheme } = preferences;
    this.setState({ colorScheme });
  };

  _getTheme = () => {
    if (this.props.theme) {
      return this.props.theme;
    } else {
      return this.state.colorScheme === 'light' ? DefaultTheme : DarkTheme;
    }
  };

  render() {
    return (
      <PortalHost>
        <SettingsProvider
          value={this.props.settings || { icon: MaterialCommunityIcon }}
        >
          <ThemeProvider theme={this._getTheme()}>
            {this.props.children}
          </ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    );
  }
}
