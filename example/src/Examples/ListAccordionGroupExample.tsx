import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, withTheme, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  expandedId: string | number | undefined;
};

class ListAccordionGroupExample extends React.Component<Props, State> {
  static title = 'List.AccordionGroup';

  state = {
    expandedId: undefined,
  };

  _onAccordionPress = (expandedId: string | number) => {
    this.setState(({ expandedId: currentExpandedId }) => ({
      expandedId: currentExpandedId === expandedId ? undefined : expandedId,
    }));
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    const { expandedId } = this.state;

    return (
      <ScrollView style={[styles.container, { backgroundColor: background }]}>
        <List.AccordionGroup>
          <List.Section title="Uncontrolled Accordion Group example">
            <List.Accordion
              left={props => <List.Icon {...props} icon="folder" />}
              title="Expandable list item"
              id="1"
            >
              <List.Item title="List item 1" />
              <List.Item title="List item 2" />
            </List.Accordion>
            <List.Accordion
              left={props => <List.Icon {...props} icon="folder" />}
              title="Expandable list item 2"
              id="2"
            >
              <List.Item title="List item 1" />
            </List.Accordion>
            <List.Accordion
              left={props => <List.Icon {...props} icon="folder" />}
              title="Expandable list item 2"
              id="3"
            >
              <List.Item title="Another item" />
            </List.Accordion>
          </List.Section>
        </List.AccordionGroup>
        <List.AccordionGroup
          expandedId={expandedId}
          onAccordionPress={this._onAccordionPress}
        >
          <List.Section title="Controlled Accordion Group example">
            <List.Accordion
              left={props => <List.Icon {...props} icon="folder" />}
              title="Expandable list item"
              id="1"
            >
              <List.Item title="List item 1" />
              <List.Item title="List item 2" />
            </List.Accordion>
            <List.Accordion
              left={props => <List.Icon {...props} icon="folder" />}
              title="Expandable list item 2"
              id="2"
            >
              <List.Item title="List item 1" />
            </List.Accordion>
            <List.Accordion
              left={props => <List.Icon {...props} icon="folder" />}
              title="Expandable list item 2"
              id="3"
            >
              <List.Item title="Another item" />
            </List.Accordion>
          </List.Section>
        </List.AccordionGroup>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(ListAccordionGroupExample);
