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

const PreferencesContext: any = createReactContext();

const App = createDrawerNavigator(
  { Home: { screen: RootNavigator } },
  {
    contentComponent: () => (
      <PreferencesContext.Consumer>
        {preferences => (
          <DrawerItems
            toggleTheme={preferences.theme}
            toggleRTL={preferences.rtl}
            isRTL={preferences.isRTL}
            isDarkTheme={preferences.isDarkTheme}
          />
        )}
      </PreferencesContext.Consumer>
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

  async componentDidMount() {
    StatusBar.setBarStyle('light-content');

    try {
      const prefString = await AsyncStorage.getItem('preferences');
      const preferences = JSON.parse(prefString);

      if (preferences) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(state => ({
          theme: preferences.theme === 'dark' ? DarkTheme : DefaultTheme,
          rtl:
            typeof preferences.rtl === 'boolean' ? preferences.rtl : state.rtl,
        }));
      }
    } catch (e) {
      // ignore error
    }
  }

  _savePreferences = async () => {
    try {
      AsyncStorage.setItem(
        'preferences',
        JSON.stringify({
          theme: this.state.theme === DarkTheme ? 'dark' : 'light',
          rtl: this.state.rtl,
        })
      );
    } catch (e) {
      // ignore error
    }
  };

  _toggleTheme = () =>
    this.setState(
      state => ({
        theme: state.theme === DarkTheme ? DefaultTheme : DarkTheme,
      }),
      this._savePreferences
    );

  _toggleRTL = () =>
    this.setState(
      state => ({
        rtl: !state.rtl,
      }),
      async () => {
        await this._savePreferences();

        I18nManager.forceRTL(this.state.rtl);
        Util.reload();
      }
    );

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <PreferencesContext.Provider
          value={{
            theme: this._toggleTheme,
            rtl: this._toggleRTL,
            isRTL: this.state.rtl,
            isDarkTheme: this.state.theme === DarkTheme,
          }}
        >
          <App
            persistenceKey={
              process.env.NODE_ENV !== 'production'
                ? 'NavigationStateDEV'
                : null
            }
          />
        </PreferencesContext.Provider>
        <KeepAwake />
      </PaperProvider>
    );
  }
}
