import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function Preview({
  children,
  jsCode,
  tsCode,
}: {
  children: React.ReactNode;
  jsCode: string;
  tsCode?: string;
}) {
  const theme = useTheme();
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          minHeight: 120,
          elevation: 0,
          borderRadius: 8,
          borderWidth: 1,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.surfaceVariant,
        }}
      >
        {children}
      </View>
    </>
  );
}
