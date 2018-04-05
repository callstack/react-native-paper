/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { List, ListItem, Divider, Text, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ListExample extends React.Component<Props> {
  static title = 'List';

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <List title="Single-line text">
          <ListItem text="Item 1" />
          <ListItem text="Item 2" />
          <ListItem text="Item 3" />
        </List>
        <Divider />
        <List title="Two-line with icon">
          <ListItem
            icon="folder"
            text="List item 1"
            secondaryText="Describes clickable item 1"
            onPress={() => {
              Alert.alert('clickable element');
            }}
          />
          <ListItem
            icon="add"
            text="List item 2"
            secondaryText="Describes item 2"
          />
          <ListItem
            icon="perm-identity"
            text="List item 3"
            secondaryText={
              <Text style={{ color: 'red' }}>Describes important item 3</Text>
            }
          />
        </List>
        <Divider />
        <List title="Two-line with avatar">
          <ListItem
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            text="List item 1"
            secondaryText="Describes item 1"
          />
          <ListItem
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            text="List item 2"
            secondaryText="Describes item 2"
          />
          <ListItem
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            text="List item 3"
            secondaryText="Describes item 3"
          />
        </List>
        <Divider />
        <List title="Three-line with icon and avatar">
          <ListItem
            icon="folder"
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            text="List item 1"
            secondaryText="Describes item 1. Example of a long description."
          />
          <ListItem
            icon="add"
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            text="List item 2"
            secondaryText="Describes item 2. Example of a long description."
          />
          <ListItem
            icon="perm-identity"
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            text="List item 3"
            secondaryText="Describes item 3. Example of a long description."
          />
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(ListExample);
