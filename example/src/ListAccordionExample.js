/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ListSection, Divider, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ListAccordionExample extends React.Component<Props> {
  static title = 'ListSection.Accordion';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <ListSection title="Expandable list item">
          <ListSection.Accordion
            left={<ListSection.Icon icon="folder" />}
            title="Expandable list item"
          >
            <ListSection.Item title="List item 1" />
            <ListSection.Item title="List item 2" />
          </ListSection.Accordion>
        </ListSection>
        <Divider />
        <ListSection title="Expandable & multiline list item">
          <ListSection.Accordion
            title="Expandable list item"
            description="Describes the expandable list item"
          >
            <ListSection.Item title="List item 1" />
            <ListSection.Item title="List item 2" />
          </ListSection.Accordion>
        </ListSection>
        <Divider />
        <ListSection title="Expandable list with icons">
          <ListSection.Accordion
            left={<ListSection.Icon icon="star" />}
            title="Accordion item 1"
          >
            <ListSection.Item
              left={<ListSection.Icon icon="thumb-up" />}
              title="List item 1"
            />
            <ListSection.Item
              left={<ListSection.Icon icon="thumb-down" />}
              title="List item 2"
            />
          </ListSection.Accordion>
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

export default withTheme(ListAccordionExample);
