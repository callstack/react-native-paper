import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text, View } from 'react-native';
import ListItem from '../List/ListItem.tsx';
import ListIcon from '../List/ListIcon.tsx';
import Chip from '../Chip';

it('renders list item with title and description', () => {
  const tree = renderer
    .create(
      <ListItem title="First Item" description="Description for first item" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with left item', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        left={props => <ListIcon {...props} icon="folder" />}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with right item', () => {
  const tree = renderer
    .create(<ListItem title="First Item" right={() => <Text>GG</Text>} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with left and right items', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        description="Item description"
        left={() => <Text>GG</Text>}
        right={props => <ListIcon {...props} icon="folder" />}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with custom title and description styles', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        description="Item description"
        titleStyle={{ fontSize: 20 }}
        descriptionStyle={{ color: 'red' }}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with custom description', () => {
  const tree = renderer
    .create(
      <ListItem
        title="List Item with custom description"
        description={({ ellipsizeMode, color: descriptionColor, fontSize }) => (
          <View>
            <Text
              numberOfLines={2}
              ellipsizeMode={ellipsizeMode}
              style={{ color: descriptionColor, fontSize }}
            >
              React Native Paper is a high-quality, standard-compliant Design
              Design library that has you covered in all major use-cases.
            </Text>
            <View>
              <Chip icon="file-pdf" onPress={() => {}}>
                DOCS.pdf
              </Chip>
            </View>
          </View>
        )}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with a description with typeof number', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        description={123}
        titleStyle={{ fontSize: 20 }}
        descriptionStyle={{ color: 'red' }}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
