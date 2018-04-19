/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  ListAccordion,
  ListSection,
  ListItem,
  Divider,
  withTheme,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class ListAccordionExample extends React.Component<Props> {
  static title = 'ListAccordion';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <ListSection title="Expandable list item">
          <ListAccordion icon="folder" title="Expandable list item">
            <ListItem title="List item 1" />
            <ListItem title="List item 2" />
          </ListAccordion>
        </ListSection>
        <Divider />
        <ListSection title="Expandable & multiline list item">
          <ListAccordion
            title="Expandable list item"
            description="Describes the expandable list item"
          >
            <ListItem title="List item 1" />
            <ListItem title="List item 2" />
          </ListAccordion>
        </ListSection>
        <Divider />
        <ListSection title="Expandable list with icons">
          <ListAccordion icon="star" title="Accordion item 1">
            <ListItem icon="thumb-up" title="List item 1" />
            <ListItem icon="thumb-down" title="List item 2" />
          </ListAccordion>
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
