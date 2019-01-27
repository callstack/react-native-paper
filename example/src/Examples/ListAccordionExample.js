/* @flow */

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Divider, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  expanded: boolean,
};

class ListAccordionExample extends React.Component<Props, State> {
  static title = 'List.Accordion';

  state = {
    expanded: true,
  };

  _handlePress = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <List.Section title="Expandable list item">
          <List.Accordion
            left={props => <List.Icon {...props} icon="folder" />}
            title="Expandable list item"
          >
            <List.Item title="List item 1" />
            <List.Item title="List item 2" />
          </List.Accordion>
          <List.Accordion
            left={props => <List.Icon {...props} icon="folder" />}
            title="Start expanded"
            expanded={this.state.expanded}
            onPress={this._handlePress}
          >
            <List.Item title="List item 1" />
          </List.Accordion>
        </List.Section>
        <Divider />
        <List.Section title="Expandable & multiline list item">
          <List.Accordion
            title="Expandable list item"
            description="Describes the expandable list item"
          >
            <List.Item title="List item 1" />
            <List.Item title="List item 2" />
          </List.Accordion>
        </List.Section>
        <Divider />
        <List.Section title="Expandable list with icons">
          <List.Accordion
            left={props => <List.Icon {...props} icon="star" />}
            title="Accordion item 1"
          >
            <List.Item
              left={props => <List.Icon {...props} icon="thumb-up" />}
              title="List item 1"
            />
            <List.Item
              left={props => <List.Icon {...props} icon="thumb-down" />}
              title="List item 2"
            />
          </List.Accordion>
        </List.Section>
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
