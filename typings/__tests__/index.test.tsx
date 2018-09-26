import * as React from 'react';
import { View } from 'react-native';
import { Provider, DefaultTheme } from '../..';

class ProviderThemeTest extends React.Component {
  render() {
    return (
      <Provider theme={DefaultTheme}>
        <View />
      </Provider>
    );
  }
}
