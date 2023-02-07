import { useColorMode } from '@docusaurus/theme-common';
import dracula from 'prism-react-renderer/themes/dracula';
import github from 'prism-react-renderer/themes/github';
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
    borderRadius: 6,
    borderWidth: 1,
  },
});

function Preview({ jsCode }: { jsCode: string }) {
  const theme = useTheme();
  const isDarkTheme = useColorMode().colorMode === 'dark';

  return (
    <LiveProvider
      code={jsCode}
      theme={isDarkTheme ? dracula : github}
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
      <LiveEditor
        padding={16}
        style={{
          borderRadius: 'var(--ifm-pre-border-radius)',
          boxShadow: 'var(--ifm-global-shadow-lw)',
          font: 'var(--ifm-code-font-size) / var(--ifm-pre-line-height) var(--ifm-font-family-monospace)',
          marginBottom: 16,
        }}
      />
      <LiveError style={{ marginBottom: 16 }} />
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
