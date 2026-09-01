import type { GestureResponderEvent } from 'react-native';
import { Platform, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { fireEvent, render, screen } from '../../test-utils';
import { red500 } from '../../theme/colors';
import Chip from '../Chip/Chip';
import IconButton from '../IconButton/IconButton';
import ListIcon from '../List/ListIcon';
import ListImage from '../List/ListImage';
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
  avatar: {
    width: 40,
    height: 40,
  },
  image: {
    width: 56,
    height: 56,
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

it('hits the one line container height without measuring the description', async () => {
  await render(<ListItem title="First Item" testID={testID} />);

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 56,
    paddingVertical: 8,
  });
});

it('hits the two and three line container heights without measuring', async () => {
  await render(
    <ListItem
      title="First Item"
      description="Item description"
      testID={testID}
    />
  );

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 72,
    paddingVertical: 8,
  });

  await fireEvent(screen.getByText('Item description'), 'textLayout', {
    nativeEvent: { lines: [{}, {}] },
  });

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 72,
    paddingVertical: 12,
  });
});

it('leaves a 40dp leading element on the one line container height', async () => {
  await render(
    <ListItem
      title="First Item"
      left={(props) => (
        <View testID="left-accessory" style={[props.style, styles.avatar]} />
      )}
      testID={testID}
    />
  );

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 56,
    paddingVertical: 8,
  });
  expect(screen.getByTestId('left-accessory')).toHaveStyle({ height: 40 });
});

it('leaves a 56dp leading image on the two line container height', async () => {
  await render(
    <ListItem
      title="First Item"
      description="Item description"
      left={(props) => (
        <View testID="left-accessory" style={[props.style, styles.image]} />
      )}
      testID={testID}
    />
  );

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 72,
    paddingVertical: 8,
  });
  expect(screen.getByTestId('left-accessory')).toHaveStyle({ height: 56 });
});

it('pads a 64dp leading video to the three line container height', async () => {
  await render(
    <ListItem
      title="First Item"
      left={(props) => (
        <ListImage
          variant="video"
          style={props.style}
          source={{ uri: 'https://www.someurl.com/apple' }}
        />
      )}
      testID={testID}
    />
  );

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 56,
    paddingVertical: 8,
  });
  expect(screen.getByTestId('list-image')).toHaveStyle({
    height: 64,
    marginVertical: 4,
  });
});

it('keeps a 64dp leading video on the same height once the description wraps', async () => {
  await render(
    <ListItem
      title="First Item"
      description="Item description"
      left={(props) => (
        <ListImage
          variant="video"
          style={props.style}
          source={{ uri: 'https://www.someurl.com/apple' }}
        />
      )}
      testID={testID}
    />
  );

  await fireEvent(screen.getByText('Item description'), 'textLayout', {
    nativeEvent: { lines: [{}, {}] },
  });

  expect(screen.getByTestId(testID)).toHaveStyle({ paddingVertical: 12 });
  expect(screen.getByTestId('list-image')).toHaveStyle({
    height: 64,
    marginVertical: 0,
  });
});

it('top aligns the accessories once the description wraps', async () => {
  await render(
    <ListItem
      title="First Item"
      description="Item description"
      left={(props) => <View testID="left-accessory" style={props.style} />}
      testID={testID}
    />
  );

  expect(screen.getByTestId('left-accessory')).toHaveStyle({
    alignSelf: 'center',
  });

  await fireEvent(screen.getByText('Item description'), 'textLayout', {
    nativeEvent: { lines: [{}, {}] },
  });

  expect(screen.getByTestId('left-accessory')).toHaveStyle({
    alignSelf: 'flex-start',
  });
});

it('applies the theme override to title and description typography', async () => {
  await render(
    <ListItem
      title="First Item"
      description="Item description"
      testID={testID}
      theme={{
        fonts: { bodyLarge: { fontSize: 99 }, bodyMedium: { fontSize: 77 } },
      }}
    />
  );

  expect(screen.getByText('First Item')).toHaveStyle({ fontSize: 99 });
  expect(screen.getByText('Item description')).toHaveStyle({ fontSize: 77 });
});
