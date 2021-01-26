import React from 'react';
import { Dropdown, List, IconButton, useTheme } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

const DropdownExample = () => {
  const theme = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <List.Section title="Dropdown with custom labels">
        <View style={styles.dropdown}>
          <Dropdown placeholder="Pick a snack" unselectLabel="I'm not hungry">
            <Dropdown.Option
              optionKey={1}
              value={1}
              label="Cupcake"
              title="Cupcake"
              description="356 calories"
            />
            <Dropdown.Option
              optionKey={2}
              value={2}
              label="Eclair"
              title="Eclair"
              description="262 calories"
            />
            <Dropdown.Option
              optionKey={3}
              value={3}
              label="Frozen Yogurt"
              title="Frozen Yogurt"
              description="159 calories"
            />
            <Dropdown.Option
              optionKey={4}
              value={4}
              label="Gingerbread"
              title="Gingerbread"
              description="305 calories"
            />
            <Dropdown.Option
              optionKey={5}
              value={5}
              label="Ice cream sandwich"
              title="Ice cream sandwich"
              description="237 calories"
            />
            <Dropdown.Option
              optionKey={6}
              value={6}
              label="Jelly Bean"
              title="Jelly Bean"
              description="375 calories"
            />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Dropdown with option icon">
        <View style={styles.dropdown}>
          <Dropdown unselectIcon={() => <IconButton icon="minus-circle" />}>
            <Dropdown.Option
              optionKey={1}
              value={1}
              left={() => <IconButton icon="numeric-1-circle" />}
              title="Option 2"
            />
            <Dropdown.Option
              optionKey={2}
              value={2}
              left={() => <IconButton icon="numeric-2-circle" />}
              title="Option 2"
            />
            <Dropdown.Option
              optionKey={3}
              value={3}
              left={() => <IconButton icon="numeric-3-circle" />}
              title="Option 3"
            />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Required option dropdown">
        <View style={styles.dropdown}>
          <Dropdown required selectedKey={1}>
            <Dropdown.Option optionKey={1} value={1} title="Option 1" />
            <Dropdown.Option optionKey={2} value={2} title="Option 2" />
            <Dropdown.Option optionKey={3} value={3} title="Option 3" />
          </Dropdown>
        </View>
      </List.Section>
    </ScrollView>
  );
};

DropdownExample.title = 'Dropdown';

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 8,
  },
});

export default DropdownExample;
