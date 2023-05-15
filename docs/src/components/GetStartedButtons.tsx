import * as React from 'react';
import { StyleSheet, View } from 'react-native';

//@ts-ignore
import BrowserOnly from '@docusaurus/BrowserOnly';
//@ts-ignore
import Link from '@docusaurus/Link';
//@ts-ignore
import { useColorMode } from '@docusaurus/theme-common';
import {
  Button,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
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
      <Link to="/docs/guides/getting-started" style={noTextDecoration}>
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

const Shimmer = () => {
  /* Docusaurus won't call StyleSheet.create() server-side */
  /* eslint-disable react-native/no-inline-styles, react-native/no-color-literals */

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 18,
      }}
    >
      <View
        style={{
          width: 121,
          marginRight: 16,
          borderWidth: 1,
          borderColor: 'rgba(125, 82, 96, 0.4)',
          borderStyle: 'solid',
          borderRadius: 40,
          height: 40,
        }}
      />
      <View
        style={{
          width: 132,
          borderWidth: 1,
          borderColor: 'rgba(125, 82, 96, 0.4)',
          borderStyle: 'solid',
          borderRadius: 40,
          height: 40,
        }}
      />
    </View>
  );
};

const ThemedGetStarted = () => {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <PaperProvider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <GetStartedButton />
    </PaperProvider>
  );
};

export default function ClientSideGetStarted() {
  return (
    <BrowserOnly fallback={<Shimmer />}>
      {() => <ThemedGetStarted />}
    </BrowserOnly>
  );
}
