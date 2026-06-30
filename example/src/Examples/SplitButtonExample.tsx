import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { List, Menu, SplitButton, Switch, useTheme } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const modes = ['filled', 'tonal', 'elevated', 'outlined'] as const;
const SplitButtonExample = () => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();

  return (
    <ScreenWrapper>
      <List.Section title="Playground">
        <View style={styles.playground}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchorPosition="bottom"
            anchor={
              <SplitButton
                label="Send"
                icon="send"
                mode="filled"
                disabled={disabled}
                loading={loading}
                onPress={() => {}}
                onTrailingPress={() => setMenuVisible(true)}
                trailingAccessibilityLabel="Show send options"
                trailingAccessibilityState={{ expanded: menuVisible }}
              />
            }
          >
            <Menu.Item
              leadingIcon="schedule"
              title="Schedule send"
              onPress={() => setMenuVisible(false)}
            />
            <Menu.Item
              leadingIcon="content-save"
              title="Save draft"
              onPress={() => setMenuVisible(false)}
            />
          </Menu>
        </View>
        <List.Item
          title="Disabled"
          right={() => <Switch value={disabled} onValueChange={setDisabled} />}
        />
        <List.Item
          title="Loading"
          right={() => <Switch value={loading} onValueChange={setLoading} />}
        />
      </List.Section>

      <List.Section title="Modes">
        <View style={styles.row}>
          {modes.map((mode) => (
            <SplitButton
              key={mode}
              mode={mode}
              icon="plus"
              label={mode}
              onPress={() => {}}
              onTrailingPress={() => {}}
              trailingAccessibilityLabel={`${mode} options`}
            />
          ))}
        </View>
      </List.Section>

      <List.Section title="Custom">
        <View style={styles.column}>
          <SplitButton
            mode="outlined"
            icon="palette"
            label="Custom color"
            buttonColor={theme.colors.tertiaryContainer}
            textColor={theme.colors.onTertiaryContainer}
            onPress={() => {}}
            onTrailingPress={() => {}}
            trailingAccessibilityLabel="Custom color options"
          />
          <SplitButton
            mode="filled"
            label="Custom label style"
            icon="format-bold"
            labelStyle={styles.boldLabel}
            onPress={() => {}}
            onTrailingPress={() => {}}
            trailingAccessibilityLabel="Custom label options"
          />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

SplitButtonExample.title = 'SplitButton';

const styles = StyleSheet.create({
  playground: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  column: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 16,
  },
  boldLabel: {
    fontWeight: '800',
  },
});

export default SplitButtonExample;
