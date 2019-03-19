import * as React from 'react';
import { List } from '..';

class MyComponent extends React.Component {
  render() {
    return (
      <List.Section>
        <List.Subheader>Some title</List.Subheader>
        <List.Item
          title="First Item"
          left={() => <List.Icon color="#000" icon="folder" />}
        />
        <List.Item
          title="Second Item"
          left={() => <List.Icon color="#000" icon="folder" />}
        />
      </List.Section>
    );
  }
}

export default MyComponent;
