import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Switch, Text, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View style={styles.row}>
    <Text>{label}</Text>
    <View style={styles.right}>{children}</View>
  </View>
);

const SwitchExample = () => {
  const theme = useTheme();
  const [defaultOn, setDefaultOn] = React.useState(true);
  const [defaultCheckedIconOn, setDefaultCheckedIconOn] = React.useState(true);
  const [defaultIconOn, setDefaultIconOn] = React.useState(true);
  const [customOn, setCustomOn] = React.useState(true);
  const [customIconOn, setCustomIconOn] = React.useState(true);
  const [disableAll, setDisableAll] = React.useState(false);

  const tertiaryTheme = React.useMemo(
    () => ({
      colors: {
        primary: theme.colors.tertiary,
        onPrimary: theme.colors.onTertiary,
        primaryContainer: theme.colors.tertiaryContainer,
        secondary: theme.colors.tertiary,
      },
    }),
    [theme]
  );

  return (
    <ScreenWrapper style={styles.container}>
      <Row label="Default">
        <Switch
          value={defaultOn}
          onValueChange={setDefaultOn}
          disabled={disableAll}
        />
      </Row>

      <Row label="Default with icon when on">
        <Switch
          value={defaultCheckedIconOn}
          onValueChange={setDefaultCheckedIconOn}
          checkedIcon="check"
          disabled={disableAll}
        />
      </Row>

      <Row label="Default with icon">
        <Switch
          value={defaultIconOn}
          onValueChange={setDefaultIconOn}
          checkedIcon="check"
          uncheckedIcon="close"
          disabled={disableAll}
        />
      </Row>

      <Row label="Custom (tertiary theme)">
        <Switch
          value={customOn}
          onValueChange={setCustomOn}
          theme={tertiaryTheme}
          disabled={disableAll}
        />
      </Row>

      <Row label="Custom with icon">
        <Switch
          value={customIconOn}
          onValueChange={setCustomIconOn}
          checkedIcon="white-balance-sunny"
          uncheckedIcon="moon-waning-crescent"
          theme={tertiaryTheme}
          disabled={disableAll}
        />
      </Row>

      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />

      <Row label="Disable all switches">
        <Switch value={disableAll} onValueChange={setDisableAll} />
      </Row>
    </ScreenWrapper>
  );
};

SwitchExample.title = 'Switch';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 16,
  },
});

export default SwitchExample;
