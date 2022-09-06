import { List, Divider } from 'react-native-paper';
import * as React from 'react';
import ScreenWrapper from '../ScreenWrapper';

const ListAccordionExample = () => {
  const [expanded, setExpanded] = React.useState<boolean>(true);

  const _handlePress = () => {
    setExpanded(!expanded);
  };

  return (
    <ScreenWrapper>
      <List.Section title="Expandable list item">
        <List.Accordion
          left={(props) => <List.Icon {...props} icon="folder" />}
          title="Expandable list item"
        >
          <List.Item title="List item 1" />
          <List.Item title="List item 2" />
        </List.Accordion>
        <List.Accordion
          left={(props) => <List.Icon {...props} icon="folder" />}
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
          left={(props) => <List.Icon {...props} icon="star" />}
          title="Accordion item 1"
        >
          <List.Item
            left={(props) => <List.Icon {...props} icon="thumb-up" />}
            title="List item 1"
          />
          <List.Item
            left={(props) => <List.Icon {...props} icon="thumb-down" />}
            title="List item 2"
          />
        </List.Accordion>
      </List.Section>
    </ScreenWrapper>
  );
};

ListAccordionExample.title = 'List.Accordion';

export default ListAccordionExample;
