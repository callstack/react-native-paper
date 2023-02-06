import { useColorMode } from '@docusaurus/theme-common';
import * as React from 'react';
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
} from 'react-live-runner';
import * as ReactNative from 'react-native';
import { StyleSheet, View } from 'react-native';
import * as ReactNativePaper from 'react-native-paper';
import {
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as DefaultTheme,
  Provider,
  useTheme,
} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 480,
    minHeight: 100,
    position: 'relative',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});

function Preview({ jsCode }: { jsCode: string }) {
  const theme = useTheme();

  return (
    <LiveProvider
      code={jsCode}
      scope={{
        import: {
          react: React,
          'react-native': ReactNative,
          'react-native-paper': ReactNativePaper,
        },
      }}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.surfaceVariant,
            },
          ]}
        >
          <LivePreview />
        </View>
      </View>
      <LiveEditor />
      <LiveError />
    </LiveProvider>
  );
}

export default function PreviewProvider({ jsCode }: { jsCode: string }) {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <Provider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <Preview jsCode={jsCode} />
    </Provider>
  );
}
