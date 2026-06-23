import type { GestureResponderEvent } from 'react-native';
import { Platform, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { red500 } from '../../theme/colors';
import Chip from '../Chip/Chip';
import IconButton from '../IconButton/IconButton';
import ListIcon from '../List/ListIcon';
import ListItem from '../List/ListItem';

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  description: {
    color: red500,
  },
  content: {
    paddingLeft: 0,
  },
});

const testID = 'list-item';

it('renders list item with title and description', async () => {
  const tree = (
    await render(
      <ListItem
        title="First Item"
        testID={testID}
        description="Description for first item"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with left item', async () => {
  const tree = (
    await render(
      <ListItem
        title="First Item"
        testID={testID}
        left={(props) => <ListIcon {...props} icon="folder" />}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with right item', async () => {
  const tree = (
    await render(
      <ListItem
        title="First Item"
        testID={testID}
        right={() => <Text>GG</Text>}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with left and right items', async () => {
  const tree = (
    await render(
      <ListItem
        title="First Item"
        description="Item description"
        testID={testID}
        left={() => <Text>GG</Text>}
        right={(props) => <ListIcon {...props} icon="folder" />}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with custom title and description styles', async () => {
  const tree = (
    await render(
      <ListItem
        title="First Item"
        description="Item description"
        testID={testID}
        titleStyle={styles.title}
        descriptionStyle={styles.description}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with custom description', async () => {
  const tree = (
    await render(
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
              <Chip icon="file-pdf-box" onPress={() => {}}>
                DOCS.pdf
              </Chip>
            </View>
          </View>
        )}
        testID={testID}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with a description with typeof number', async () => {
  const tree = (
    await render(
      <ListItem
        title="First Item"
        description={123}
        titleStyle={styles.title}
        descriptionStyle={styles.description}
        testID={testID}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('calling onPress on ListItem right component', async () => {
  Platform.OS = 'web';
  const onPress = jest.fn<(event: GestureResponderEvent) => void>();

  await render(
    <ListItem
      title="First Item"
      description="Item description"
      testID={testID}
      right={() => <IconButton icon="pencil" onPress={onPress} />}
    />
  );

  await userEvent.press(screen.getByTestId('icon-button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('renders list item with custom content style', async () => {
  await render(
    <ListItem
      title="First Item"
      description="Item description"
      contentStyle={styles.content}
      testID={testID}
    />
  );

  expect(screen.getByTestId('list-item-content')).toHaveStyle(styles.content);
});
