import * as React from 'react';
import { StyleSheet } from 'react-native';

import { render } from '@testing-library/react-native';

import { Colors } from '../../styles/themes/tokens';
import ListIcon from '../List/ListIcon';
import ListItem from '../List/ListItem';
import ListSection from '../List/ListSection';
import ListSubheader from '../List/ListSubheader';

const styles = StyleSheet.create({
  itemColor: {
    color: Colors.error50,
  },
});

const testID = 'list-item';

it('renders list section without subheader', () => {
  const tree = render(
    <ListSection>
      <ListItem
        title="First Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
      <ListItem
        title="Second Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
    </ListSection>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list section with subheader', () => {
  const tree = render(
    <ListSection>
      <ListSubheader>Some title</ListSubheader>
      <ListItem
        title="First Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
      <ListItem
        title="Second Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
    </ListSection>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list section with custom title style', () => {
  const tree = render(
    <ListSection title="Some title" titleStyle={styles.itemColor}>
      <ListItem
        title="First Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
      <ListItem
        title="Second Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
    </ListSection>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
