/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import ListSection from '../List/ListSection';
import ListItem from '../List/ListItem';
import ListIcon from '../List/ListIcon';
import ListSubheader from '../List/ListSubheader';

it('renders list section without subheader', () => {
  const tree = renderer
    .create(
      <ListSection>
        <ListItem
          title="First Item"
          left={props => <ListIcon {...props} icon="folder" />}
        />
        <ListItem
          title="Second Item"
          left={props => <ListIcon {...props} icon="folder" />}
        />
      </ListSection>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list section with subheader', () => {
  const tree = renderer
    .create(
      <ListSection>
        <ListSubheader>Some title</ListSubheader>
        <ListItem
          title="First Item"
          left={props => <ListIcon {...props} icon="folder" />}
        />
        <ListItem
          title="Second Item"
          left={props => <ListIcon {...props} icon="folder" />}
        />
      </ListSection>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
