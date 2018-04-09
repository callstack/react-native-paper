/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet, Image, Alert } from 'react-native';
import {
  ListSection,
  ListItem,
  Divider,
  Text,
  withTheme,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ListSectionExample extends React.Component<Props> {
  static title = 'ListSection';

  render() {
    const { theme: { colors: { background } } } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <ListSection title="Single-line text">
          <ListItem title="Item 1" />
          <ListItem title="Item 2" />
          <ListItem title="Item 3" />
        </ListSection>
        <Divider />
        <ListSection title="Two-line with icon">
          <ListItem
            icon="folder"
            title="List item 1"
            description="Describes clickable item 1"
            onPress={() => {
              Alert.alert('clickable element');
            }}
          />
          <ListItem
            icon="add"
            title="List item 2"
            description="Describes item 2"
          />
          <ListItem
            icon="perm-identity"
            title="List item 3"
            description={
              <Text style={{ color: 'red' }}>Describes important item 3</Text>
            }
          />
        </ListSection>
        <Divider />
        <ListSection title="Two-line with avatar">
          <ListItem
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            title="List item 1"
            description="Describes item 1"
          />
          <ListItem
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            title="List item 2"
            description="Describes item 2"
          />
          <ListItem
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            title="List item 3"
            description="Describes item 3"
          />
        </ListSection>
        <Divider />
        <ListSection title="Three-line with icon and avatar">
          <ListItem
            icon="folder"
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            title="List item 1"
            description="Describes item 1. Example of a long description."
          />
          <ListItem
            icon="add"
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            title="List item 2"
            description="Describes item 2. Example of a long description."
          />
          <ListItem
            icon="perm-identity"
            avatar={
              <Image
                source={require('../assets/avatar.png')}
                style={{ width: 48, height: 48 }}
              />
            }
            title="List item 3"
            description="Describes item 3. Example of a long description."
          />
        </ListSection>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(ListSectionExample);
