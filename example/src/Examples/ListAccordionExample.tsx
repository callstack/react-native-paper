import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';

const ListAccordionExample = () => {
  const [expanded, setExpanded] = React.useState<boolean>(true);

  const _handlePress = () => {
    setExpanded(!expanded);
  };

  const {
    colors: { background },
  } = useTheme();

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
          expanded={expanded}
          onPress={_handlePress}
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
};

ListAccordionExample.title = 'List.Accordion';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ListAccordionExample;
