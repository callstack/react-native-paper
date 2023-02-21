import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import {
  Button,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as DefaultTheme,
  Provider,
} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  button: {
    marginRight: 16,
  },
});

const noTextDecoration = {
  textDecoration: 'none',
};

// Needed for ripple effect when pressing `Button`, however navigation is handled by `Link`
const noop = () => {};

const GetStartedButton = () => {
  return (
    <View style={styles.container}>
      <Link to="docs/guides/getting-started" style={noTextDecoration}>
        <Button mode="contained" style={styles.button} onPress={noop}>
          Get started
        </Button>
      </Link>
      <Button
        mode="outlined"
        onPress={() =>
          window.open(
            'https://snack.expo.dev/@react-native-paper/react-native-paper-example_v5'
          )
        }
      >
        Try on Snack
      </Button>
    </View>
  );
};

export default function WithProvider() {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <BrowserOnly>
      {() => (
        <Provider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
          <GetStartedButton />
        </Provider>
      )}
    </BrowserOnly>
  );
}
