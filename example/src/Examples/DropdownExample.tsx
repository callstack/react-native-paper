import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Dropdown, List, TextInput, useTheme } from 'react-native-paper';

const options = [
  {
    id: '1',
    icon: 'dice-1',
    title: 'Dice 1',
  },
  {
    id: '2',
    icon: 'dice-2',
    title: 'Dice 2',
  },
  {
    id: '3',
    icon: 'dice-3',
    title: 'Dice 3',
  },
  {
    id: '4',
    icon: 'dice-4',
    title: 'Dice 4',
  },
  {
    id: '5',
    icon: 'dice-5',
    title: 'Dice 5',
  },
  {
    id: '6',
    icon: 'dice-6',
    title: 'Dice 6',
  },
];

const DropdownExample = () => {
  const theme = useTheme();

  const [value, setValue] = useState<string | null>(null);

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <List.Section title="Uncontrolled dropdown">
        <View style={styles.dropdown}>
          <Dropdown onChange={console.log} placeholder="Select an Option">
            {options.map(({ id, title }) => (
              <Dropdown.Item key={id} title={title} value={title} />
            ))}
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Uncontrolled dropdown with icon">
        <View style={styles.dropdown}>
          <Dropdown
            onChange={console.log}
            placeholder="Select an Option"
            left={<TextInput.Icon icon="magnify" />}
          >
            {options.map(({ id, title }) => (
              <Dropdown.Item key={id} title={title} value={title} />
            ))}
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Uncontrolled dropdown with required value">
        <View style={styles.dropdown}>
          <Dropdown
            onChange={console.log}
            placeholder="Select an Option"
            defaultValue="Dice 1"
            required
          >
            {options.map(({ id, title }) => (
              <Dropdown.Item key={id} title={title} value={title} />
            ))}
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Controlled Dropdown">
        <View style={styles.dropdown}>
          <Dropdown
            onChange={setValue}
            placeholder="Select an Option"
            value={value}
            valueText={options.filter(({ id }) => id === value)[0]?.title}
          >
            {options.map(({ id, title }) => (
              <Dropdown.Item key={id} title={title} value={id} />
            ))}
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Customized dropdown">
        <View style={styles.dropdown}>
          <Dropdown
            mode="outlined"
            onChange={setValue}
            placeholder="Select an Option"
            value={value}
            valueText={options.filter(({ id }) => id === value)[0]?.title}
            left={
              <TextInput.Icon
                icon={
                  options.filter(({ id }) => id === value)[0]?.icon ?? 'magnify'
                }
              />
            }
          >
            {options.map(({ id, title, icon }) => (
              <Dropdown.Item
                key={id}
                title={title}
                value={id}
                leadingIcon={icon}
              />
            ))}
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
