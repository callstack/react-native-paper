import { List } from 'react-native-paper';
import * as React from 'react';
import ScreenWrapper from '../ScreenWrapper';

type State = string | number | undefined;

const ListAccordionGroupExample = () => {
  const [expandedId, setExpandedId] = React.useState<State>(undefined);

  const _onAccordionPress = (newExpandedId: string | number) =>
    expandedId === newExpandedId
      ? setExpandedId(undefined)
      : setExpandedId(newExpandedId);

  return (
    <ScreenWrapper>
      <List.AccordionGroup>
        <List.Section title="Uncontrolled Accordion Group example">
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item"
            id="1"
          >
            <List.Item title="List item 1" />
            <List.Item title="List item 2" />
          </List.Accordion>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item 2"
            id="2"
          >
            <List.Item title="List item 1" />
          </List.Accordion>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item 2"
            id="3"
          >
            <List.Item title="Another item" />
          </List.Accordion>
        </List.Section>
      </List.AccordionGroup>
      <List.AccordionGroup
        expandedId={expandedId}
        onAccordionPress={_onAccordionPress}
      >
        <List.Section title="Controlled Accordion Group example">
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item"
            id="1"
          >
            <List.Item title="List item 1" />
            <List.Item title="List item 2" />
          </List.Accordion>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item 2"
            id="2"
          >
            <List.Item title="List item 1" />
          </List.Accordion>
          <List.Accordion
            left={(props) => <List.Icon {...props} icon="folder" />}
            title="Expandable list item 2"
            id="3"
          >
            <List.Item title="Another item" />
          </List.Accordion>
        </List.Section>
      </List.AccordionGroup>
    </ScreenWrapper>
  );
};

ListAccordionGroupExample.title = 'List.AccordionGroup';

export default ListAccordionGroupExample;
