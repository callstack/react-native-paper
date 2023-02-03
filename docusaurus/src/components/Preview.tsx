import { useColorMode } from '@docusaurus/theme-common';
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    minHeight: 100,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});

function Preview({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
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
        {children}
      </View>
    </View>
  );
}

export default function PreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  return (
    <Provider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <Preview>{children}</Preview>
    </Provider>
  );
}
