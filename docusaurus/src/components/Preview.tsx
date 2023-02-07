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

interface Props {
  jsCode: string;
  tsCode?: string;
}

function Preview({ jsCode }: Props) {
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
      <View
        style={[
          styles.preview,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.surfaceVariant,
          },
        ]}
      >
        <LivePreview />
      </View>

      <LiveEditor padding={16} className="live-editor" />
      <LiveError style={{ marginBottom: 16 }} />
    </LiveProvider>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    maxHeight: 480,
    minHeight: 100,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
});

export default function PreviewProvider(props: Props) {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <Provider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <Preview {...props} />
    </Provider>
  );
}
