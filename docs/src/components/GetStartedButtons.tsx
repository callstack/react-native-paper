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

const GetStartedButton = () => {
  return (
    <View style={styles.container}>
      <Link to="docs/guides/getting-started" style={{ textDecoration: 'none' }}>
        <Button mode="elevated" style={styles.button}>
          Get started
        </Button>
      </Link>
      <Button
        mode="elevated"
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
