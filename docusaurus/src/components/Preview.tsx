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
  IconButton,
  MD3DarkTheme as DarkTheme,
  MD3LightTheme as DefaultTheme,
  Provider,
  ToggleButton,
  useTheme,
} from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';

const useUuid = () => {
  const [id] = React.useState(uuidv4);
  return id;
};

const ExpoLogo = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    viewBox="0 0 24 26"
    fill="none"
  >
    <path
      d="M22.069 10.075a2.273 2.273 0 00-.887-.74 2.296 2.296 0 00-2.237.16 2.265 2.265 0 00-.77.859 2.016 2.016 0 00.392 2.274 3.342 3.342 0 002.23-.63 3.289 3.289 0 001.271-1.923zM15.3 1.3l-1.45-.788-6.31 3.481.503.27.957.498 1.732-.954 4.569-2.523-.001.016zm.584-.24a.225.225 0 01.16.15l2.114 6.182a.205.205 0 01-.1.269 4.063 4.063 0 00-1.798 1.974 4.017 4.017 0 00-.175 2.655 4.283 4.283 0 001.755 2.332c.842.55 1.852.79 2.854.68a.269.269 0 01.262.16l2.184 6.345a.256.256 0 01-.101.278l-6.712 3.89a.253.253 0 01-.101.02.27.27 0 01-.181-.03L13.69 24.5a.234.234 0 01-.1-.1l-4.6-10.483-7.005 3.95a.327.327 0 01-.272.01l-1.592-.898a.23.23 0 01-.1-.299l6.805-12.8a.243.243 0 01.11-.099L13.721.03a.259.259 0 01.241 0l1.923 1.03zM7.47 4.499L7.14 4.33.58 16.71l1.197.668 5.657-7.335a.275.275 0 01.231-.1.282.282 0 01.201.149l6.16 14.066 1.646 1.007L9.06 6.005l-.281-.798-1.318-.718.01.01zm10.145 7.382a2.51 2.51 0 01.12-1.663 2.54 2.54 0 011.138-1.23 2.798 2.798 0 013.261.4 2.513 2.513 0 01.073 3.568l-.073.073a2.77 2.77 0 01-3.788.01 2.719 2.719 0 01-.731-1.158z"
      fill={color}
    />
  </svg>
);

interface Props {
  jsCode: string;
  tsCode?: string;
}

function Preview({ jsCode, tsCode }: Props) {
  const theme = useTheme();
  const isDarkTheme = useColorMode().colorMode === 'dark';

  const [activeTab, setActiveTab] = React.useState<'js' | 'ts'>('js');

  const id = useUuid();

  const handleCopy = React.useCallback(() => {
    const editor = document.getElementById(id) as HTMLTextAreaElement;
    navigator.clipboard.writeText(editor.value);
  }, [id]);

  return (
    <LiveProvider
      code={activeTab === 'js' ? jsCode : tsCode || jsCode}
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
      <View style={styles.toolbar}>
        <ToggleButton.Row
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <ToggleButton
            icon="language-javascript"
            value="js"
            size={20}
            style={styles.action}
          />
          <ToggleButton
            icon="language-typescript"
            value="ts"
            size={20}
            style={styles.action}
          />
        </ToggleButton.Row>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton
            icon={({ color }) => <ExpoLogo color={color} />}
            size={20}
            onPress={() => {}}
          />
          <IconButton icon="content-copy" size={20} onPress={handleCopy} />
        </View>
      </View>
      <LiveEditor textareaId={id} padding={16} className="live-editor" />
      <LiveError style={{ marginBottom: 16 }} />
    </LiveProvider>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    maxHeight: 480,
    minHeight: 100,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  action: {
    width: 32,
    height: 32,
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
