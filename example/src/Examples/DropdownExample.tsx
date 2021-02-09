import React, { useState } from 'react';
import {
  Dropdown,
  List,
  IconButton,
  useTheme,
  Divider,
  Switch,
} from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

const DropdownExample = () => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState<number | null>(1);
  const [mode, setMode] = useState<'modal' | 'floating'>('floating');

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <List.Section title="Dropdown">
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
            <Dropdown.Option key={7} value={7} label="Cookies" />
            <Dropdown.Option key={8} value={8} label="Cakes" />
            <Dropdown.Option key={9} value={9} label="Fruits" />
            <Dropdown.Option key={10} value={10} label="Crepe" />
            <Dropdown.Option key={11} value={11} label="Waffle" />
            <Dropdown.Option key={12} value={12} label="Juice" />
            <Dropdown.Option key={13} value={13} label="Pie" />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Dropdown with custom content">
        <View style={styles.dropdown}>
          <Dropdown
            renderNoneOption={(props) => (
              <List.Item
                key={props.key}
                onPress={props.onPress}
                titleStyle={props.style}
                left={() => <IconButton icon="minus-circle" />}
                title="None"
              />
            )}
          >
            <Divider />
            <Dropdown.Option
              key={1}
              value={1}
              label="Option 1"
              render={(props) => (
                <List.Item
                  {...props}
                  left={() => <IconButton icon="numeric-1-circle" />}
                  title="Option 1"
                />
              )}
            />
            <Divider />
            <Dropdown.Option
              key={2}
              value={2}
              label="Option 2"
              render={(props) => (
                <List.Item
                  {...props}
                  left={() => <IconButton icon="numeric-2-circle" />}
                  title="Option 2"
                />
              )}
            />
            <Divider />
            <Dropdown.Option
              key={3}
              value={3}
              label="Option 3"
              render={(props) => (
                <List.Item
                  {...props}
                  left={() => <IconButton icon="numeric-3-circle" />}
                  title="Option 3"
                />
              )}
            />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Required option dropdown">
        <View style={styles.dropdown}>
          <Dropdown
            required
            selectedValue={selectedValue}
            onSelect={setSelectedValue}
          >
            <Dropdown.Option key={1} value={1} label="Option 1" />
            <Dropdown.Option key={2} value={2} label="Option 2" />
            <Dropdown.Option key={3} value={3} label="Option 3" />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section>
        <View style={styles.field}>
          <List.Item
            title="Floating dropdown mode"
            description="Use floating dropdown instead of modal"
            right={() => (
              <Switch
                value={mode === 'floating'}
                onValueChange={() =>
                  setMode(mode === 'modal' ? 'floating' : 'modal')
                }
              />
            )}
          />
        </View>
        <View style={[styles.dropdown, styles.field]}>
          <Dropdown mode={mode}>
            <Dropdown.Option value={1} label="Option 1" />
            <Dropdown.Option value={2} label="Option 2" />
            <Dropdown.Option value={3} label="Option 3" />
            <Dropdown.Option value={4} label="Option 4" />
            <Dropdown.Option value={5} label="Option 5" />
            <Dropdown.Option value={6} label="Option 6" />
            <Dropdown.Option value={7} label="Option 7" />
            <Dropdown.Option value={8} label="Option 8" />
            <Dropdown.Option value={9} label="Option 9" />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Empty dropdown">
        <View style={styles.dropdown}>
          <Dropdown />
        </View>
      </List.Section>
      <List.Section title="Dropdown with a disabled option">
        <View style={styles.dropdown}>
          <Dropdown>
            <Dropdown.Option value={1} disabled label="Disabled Option" />
            <Dropdown.Option value={2} label="Enabled Option" />
          </Dropdown>
        </View>
      </List.Section>
      <List.Section title="Dropdown Variants">
        <View style={[styles.dropdown, styles.field]}>
          <Dropdown inputMode="flat" label="Default flat">
            <Dropdown.Option value={1} label="Option" />
          </Dropdown>
        </View>
        <View style={[styles.dropdown, styles.field]}>
          <Dropdown inputMode="outlined" label="Default outlined">
            <Dropdown.Option value={1} label="Option" />
          </Dropdown>
        </View>
        <View style={[styles.dropdown, styles.field]}>
          <Dropdown inputMode="flat" dense label="Dense flat">
            <Dropdown.Option value={1} label="Option" />
          </Dropdown>
        </View>
        <View style={[styles.dropdown, styles.field]}>
          <Dropdown inputMode="outlined" dense label="Dense outlined">
            <Dropdown.Option value={1} label="Option" />
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
  field: {
    paddingBottom: 8,
  },
});

export default DropdownExample;
