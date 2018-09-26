import * as React from 'react';
import { List } from '../../..';
import { View } from 'react-native';

class ListAccordionTest extends React.Component {
  render() {
    return (
      <List.Accordion
        title="TITLE"
        description="DESCRIPTION"
        left={({ color }) => <View style={{ backgroundColor: color }} />}
        theme={{ colors: { background: '#FFFFFF' } }}
      >
        <View />
      </List.Accordion>
    );
  }
}

class ListIconTest extends React.Component {
  render() {
    return <List.Icon icon="SomeIcon" color="yellow" />;
  }
}

class ListSectionTest extends React.Component {
  render() {
    return (
      <List.Section title="TITLE" theme={{ colors: { background: '#000000' } }}>
        <View />
      </List.Section>
    );
  }
}
