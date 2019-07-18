import * as React from 'react';
import { ThemeProvider } from './theming';
import {
  Provider as SettingsProvider,
  Settings,
  defaultIcon,
} from './settings';
import PortalHost from '../components/Portal/PortalHost';
import { Theme } from '../types';

type Props = {
  children: React.ReactNode;
  theme?: Theme;
  settings?: Settings;
};

export default class Provider extends React.Component<Props> {
  render() {
    return (
      <PortalHost>
        <SettingsProvider value={this.props.settings || { icon: defaultIcon }}>
          <ThemeProvider theme={this.props.theme}>
            {this.props.children}
          </ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    );
  }
}
