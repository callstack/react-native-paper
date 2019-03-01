/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { List, Divider, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

class ListSectionExample extends React.Component<Props> {
  static title = 'List.Section';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <List.Section>
          <List.Subheader>Single line</List.Subheader>
          <List.Item
            left={props => <List.Icon {...props} icon="event" />}
            title="List item 1"
          />
          <List.Item
            left={props => <List.Icon {...props} icon="redeem" />}
            title="List item 2"
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Two line</List.Subheader>
          <List.Item
            left={() => (
              <Image
                source={require('../../assets/images/email-icon.png')}
                style={styles.image}
              />
            )}
            title="List item 1"
            description="Describes item 1"
          />
          <List.Item
            left={() => (
              <Image
                source={require('../../assets/images/email-icon.png')}
                style={styles.image}
              />
            )}
            right={props => <List.Icon {...props} icon="info" />}
            title="List item 2"
            description="Describes item 2"
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>Three line</List.Subheader>
          <List.Item
            left={() => (
              <Image
                source={require('../../assets/images/email-icon.png')}
                style={styles.image}
              />
            )}
            title="List item 1"
            description="Describes item 1. Example of a very very long description."
          />
          <List.Item
            left={() => (
              <Image
                source={require('../../assets/images/email-icon.png')}
                style={styles.image}
              />
            )}
            right={props => <List.Icon {...props} icon="star-border" />}
            title="List item 2"
            description="Describes item 2. Example of a very very long description."
          />
        </List.Section>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 40,
    width: 40,
    margin: 8,
  },
});

export default withTheme(ListSectionExample);
