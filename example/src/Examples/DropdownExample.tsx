import React, { useState } from 'react';
import {
  Dropdown,
  List,
  IconButton,
  useTheme,
  Divider,
} from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

const DropdownExample = () => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState(1);

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <List.Section title="Dropdown with custom labels">
        <View style={styles.dropdown}>
          <Dropdown
            placeholder="Pick a snack"
            renderNoneOption={() => "I'm not hungry"}
          >
            <Dropdown.Option key={1} value={1} label="Cupcake" />
            <Dropdown.Option key={2} value={2} label="Eclair" />
            <Dropdown.Option key={3} value={3} label="Frozen Yogurt" />
            <Dropdown.Option key={4} value={4} label="Gingerbread" />
            <Dropdown.Option key={5} value={5} label="Ice cream sandwich" />
            <Dropdown.Option key={6} value={6} label="Jelly Bean" />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Dropdown with custom content">
        <View style={styles.dropdown}>
          <Dropdown
            renderNoneOption={() => (
              <List.Item
                left={() => <IconButton icon="minus-circle" />}
                title="None"
              />
            )}
          >
            <Divider />
            <Dropdown.Option key={1} value={1} label="Option 1">
              <List.Item
                left={() => <IconButton icon="numeric-1-circle" />}
                title="Option 1"
              />
            </Dropdown.Option>
            <Divider />
            <Dropdown.Option key={2} value={2} label="Option 2">
              <List.Item
                left={() => <IconButton icon="numeric-2-circle" />}
                title="Option 2"
              />
            </Dropdown.Option>
            <Divider />
            <Dropdown.Option key={3} value={3} label="Option 3">
              <List.Item
                left={() => <IconButton icon="numeric-3-circle" />}
                title="Option 3"
              />
            </Dropdown.Option>
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Required option dropdown">
        <View style={styles.dropdown}>
          <Dropdown
            required
            selectedValue={selectedValue}
            onSelect={(value: any) => setSelectedValue(value)}
          >
            <Dropdown.Option key={1} value={1} label="Option 1" />
            <Dropdown.Option key={2} value={2} label="Option 2" />
            <Dropdown.Option key={3} value={3} label="Option 3" />
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
