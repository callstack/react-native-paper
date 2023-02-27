import * as React from 'react';
import { StyleSheet } from 'react-native';

import renderer from 'react-test-renderer';

import { red500 } from '../../styles/themes/v2/colors';
import ListIcon from '../List/ListIcon';
import ListItem from '../List/ListItem';
import ListSection from '../List/ListSection';
import ListSubheader from '../List/ListSubheader';

const styles = StyleSheet.create({
  itemColor: {
    color: red500,
  },
});

it('renders list section without subheader', () => {
  const tree = renderer
    .create(
      <ListSection>
        <ListItem
          title="First Item"
          left={(props) => <ListIcon {...props} icon="folder" />}
        />
        <ListItem
          title="Second Item"
          left={(props) => <ListIcon {...props} icon="folder" />}
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
          left={(props) => <ListIcon {...props} icon="folder" />}
        />
        <ListItem
          title="Second Item"
          left={(props) => <ListIcon {...props} icon="folder" />}
        />
      </ListSection>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list section with custom title style', () => {
  const tree = renderer
    .create(
      <ListSection title="Some title" titleStyle={styles.itemColor}>
        <ListItem
          title="First Item"
          left={(props) => <ListIcon {...props} icon="folder" />}
        />
        <ListItem
          title="Second Item"
          left={(props) => <ListIcon {...props} icon="folder" />}
        />
      </ListSection>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
