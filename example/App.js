/* @flow */

import { KeepAwake, Util } from 'expo';
import * as React from 'react';
import { StatusBar, I18nManager, AsyncStorage, Platform } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
} from 'react-native-paper';
import createReactContext from 'create-react-context';
import { createDrawerNavigator } from 'react-navigation';
import RootNavigator from './src/RootNavigator';
import DrawerItems from './DrawerItems';
import type { Theme } from 'react-native-paper/types';

type State = {
  theme: Theme,
  rtl: boolean,
};

const ToggleContext: any = createReactContext();

const App = createDrawerNavigator(
  { Home: { screen: RootNavigator } },
  {
    contentComponent: () => (
      <ToggleContext.Consumer>
        {toggle => (
          <DrawerItems
            toggleTheme={toggle.theme}
            toggleRTL={toggle.rtl}
            isRTL={toggle.isRTL}
          />
        )}
      </ToggleContext.Consumer>
    ),
    // set drawerPosition to support rtl toggle on android
    drawerPosition:
      Platform.OS === 'android' && (I18nManager.isRTL ? 'right' : 'left'),
  }
);

export default class PaperExample extends React.Component<{}, State> {
  state = {
    theme: DefaultTheme,
    rtl: I18nManager.isRTL,
  };

  componentWillMount() {
    AsyncStorage.getItem('rtl').then(rtlSetting => {
      const rtl =
        rtlSetting == null ? I18nManager.isRTL : JSON.parse(rtlSetting);
      I18nManager.forceRTL(rtl);
      this.setState({ rtl });
    });
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  _toggleTheme = () =>
    this.setState(state => ({
      theme: state.theme === DarkTheme ? DefaultTheme : DarkTheme,
    }));

  _toggleRTL = () => {
    const { rtl } = this.state;

    I18nManager.forceRTL(!rtl);
    AsyncStorage.setItem('rtl', JSON.stringify(!rtl)).then(() => Util.reload());
  };

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <ToggleContext.Provider
          value={{
            theme: this._toggleTheme,
            rtl: this._toggleRTL,
            isRTL: this.state.rtl,
          }}
        >
          <App
            persistenceKey={
              process.env.NODE_ENV !== 'production'
                ? 'NavigationStateDEV'
                : null
            }
          />
        </ToggleContext.Provider>
        <KeepAwake />
      </PaperProvider>
    );
  }
}
