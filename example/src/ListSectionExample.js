/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { ListSection, Divider, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ListSectionExample extends React.Component<Props> {
  static title = 'ListSection';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <ListSection title="Single line">
          <ListSection.Item
            left={<ListSection.Icon icon="event" />}
            title="List item 1"
          />
          <ListSection.Item
            left={<ListSection.Icon icon="redeem" />}
            title="List item 2"
          />
        </ListSection>
        <Divider />
        <ListSection title="Two line">
          <ListSection.Item
            left={
              <Image
                source={require('../assets/email-icon.png')}
                style={styles.image}
              />
            }
            title="List item 1"
            description="Describes item 1"
          />
          <ListSection.Item
            left={
              <Image
                source={require('../assets/email-icon.png')}
                style={styles.image}
              />
            }
            right={<ListSection.Icon icon="info" />}
            title="List item 2"
            description="Describes item 2"
          />
        </ListSection>
        <Divider />
        <ListSection title="Three line">
          <ListSection.Item
            left={
              <Image
                source={require('../assets/email-icon.png')}
                style={styles.image}
              />
            }
            title="List item 1"
            description="Describes item 1. Example of a very very long description."
          />
          <ListSection.Item
            left={
              <Image
                source={require('../assets/email-icon.png')}
                style={styles.image}
              />
            }
            right={<ListSection.Icon icon="star-border" />}
            title="List item 2"
            description="Describes item 2. Example of a very very long description."
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
  image: {
    height: 40,
    width: 40,
    margin: 8,
  },
});

export default withTheme(ListSectionExample);
