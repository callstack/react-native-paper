import * as React from 'react';
import { AsyncStorage } from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
  Theme,
} from 'react-native-paper';
import App from './RootNavigator';

type State = {
  theme: Theme;
};

const PreferencesContext = React.createContext<any>(null);

export default class PaperExample extends React.Component<{}, State> {
  state = {
    theme: DefaultTheme,
  };

  async componentDidMount() {
    try {
      const prefString = await AsyncStorage.getItem('preferences');
      const preferences = JSON.parse(prefString || '');

      if (preferences) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          theme: preferences.theme === 'dark' ? DarkTheme : DefaultTheme,
        });
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

  render() {
    return (
      <PaperProvider theme={this.state.theme}>
        <PreferencesContext.Provider
          value={{
            theme: this._toggleTheme,
            isDarkTheme: this.state.theme === DarkTheme,
          }}
        >
          <React.Fragment>
            <style type="text/css">{`
              @font-face {
                font-family: 'MaterialCommunityIcons';
                src: url(${require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')}) format('truetype');
              }
            `}</style>
            <App />
          </React.Fragment>
        </PreferencesContext.Provider>
      </PaperProvider>
    );
  }
}
