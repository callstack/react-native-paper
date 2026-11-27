import type { GestureResponderEvent } from 'react-native';
import { Platform, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { fireEvent, render, screen } from '../../test-utils';
import { red500 } from '../../theme/colors';
import { LightTheme } from '../../theme/schemes';
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
});

const testID = 'list-item';

afterEach(() => {
  jest.restoreAllMocks();
});

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
  jest.replaceProperty(Platform, 'OS', 'web');
  const onPress = jest.fn<(event: GestureResponderEvent) => void>();

  await render(
    <ListItem
      title="First Item"
      description="Item description"
      testID={testID}
      right={() => (
        <IconButton icon="pencil" onPress={onPress} testID="icon-button" />
      )}
    />
  );

  await userEvent.press(screen.getByTestId('icon-button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('renders list item with custom content style', async () => {
  const { toJSON } = await render(
    <ListItem
      title="First Item"
      description="Item description"
      contentStyle={styles.content}
      testID={testID}
    />
  );

  expect(toJSON()).toMatchSnapshot();
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

it('drops the three line padding when a wrapped description goes away', async () => {
  const renderItem = (description?: string) => (
    <ListItem
      title="First Item"
      description={description}
      leading={
        <ListImage
          variant="video"
          source={{ uri: 'https://picsum.photos/228/128' }}
          testID="video-thumbnail"
        />
      }
      testID={testID}
    />
  );

  await render(renderItem('Item description'));

  await fireEvent(screen.getByText('Item description'), 'textLayout', {
    nativeEvent: { lines: [{}, {}] },
  });

  await screen.rerender(renderItem());

  expect(screen.getByTestId(testID)).toHaveStyle({
    minHeight: 56,
    paddingVertical: 8,
  });
  expect(screen.getByTestId('video-thumbnail')).toHaveStyle({
    marginVertical: 4,
  });
});

// The row is 88dp tall: 2 * padding + 2 * margin + the 64dp thumbnail.
it.each([
  ['one line', undefined, false, 8, 4],
  ['two line', 'Item description', false, 8, 4],
  ['three line', 'Item description', true, 12, 0],
])(
  'makes a %s row with a video thumbnail 88dp tall',
  async (_label, description, wrapsDescription, padding, margin) => {
    await render(
      <ListItem
        title="First Item"
        description={description}
        leading={
          <ListImage
            variant="video"
            source={{ uri: 'https://picsum.photos/228/128' }}
            testID="video-thumbnail"
          />
        }
        testID={testID}
      />
    );

    if (wrapsDescription) {
      await fireEvent(screen.getByText('Item description'), 'textLayout', {
        nativeEvent: { lines: [{}, {}] },
      });
    }

    expect(screen.getByTestId(testID)).toHaveStyle({
      paddingVertical: padding,
    });
    expect(screen.getByTestId('video-thumbnail')).toHaveStyle({
      height: 64,
      marginVertical: margin,
    });
  }
);

it('does not add vertical margin to an image thumbnail', async () => {
  await render(
    <ListItem
      title="First Item"
      leading={
        <ListImage
          source={{ uri: 'https://picsum.photos/112' }}
          testID="image-thumbnail"
        />
      }
      testID={testID}
    />
  );

  expect(screen.getByTestId('image-thumbnail')).toHaveStyle({
    height: 56,
    marginVertical: undefined,
  });
});

it('colors the typed slots from the list item context', async () => {
  await render(
    <ListItem
      title="First Item"
      leading={<ListIcon icon="folder" />}
      trailing={<ListIcon icon="chevron-right" />}
      testID={testID}
    />
  );

  expect(
    screen.getByText('folder', { includeHiddenElements: true })
  ).toHaveStyle({ color: LightTheme.colors.onSurfaceVariant });
  expect(
    screen.getByText('chevron-right', { includeHiddenElements: true })
  ).toHaveStyle({ color: LightTheme.colors.onSurfaceVariant });
});

it('renders the trailing slot', async () => {
  await render(
    <ListItem
      title="First Item"
      trailing={<Text>Trailing</Text>}
      testID={testID}
    />
  );

  expect(screen.getByText('Trailing')).toBeOnTheScreen();
});

it('prefers the typed slots over the left and right render props', async () => {
  await render(
    <ListItem
      title="First Item"
      leading={<Text>Leading slot</Text>}
      trailing={<Text>Trailing slot</Text>}
      left={() => <Text>Left render prop</Text>}
      right={() => <Text>Right render prop</Text>}
      testID={testID}
    />
  );

  expect(screen.getByText('Leading slot')).toBeOnTheScreen();
  expect(screen.getByText('Trailing slot')).toBeOnTheScreen();
  expect(screen.queryByText('Left render prop')).not.toBeOnTheScreen();
  expect(screen.queryByText('Right render prop')).not.toBeOnTheScreen();
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

it.each([
  [
    'an unselected item on surface colors',
    false,
    undefined,
    LightTheme.colors.onSurface,
    LightTheme.colors.onSurfaceVariant,
  ],
  [
    'a selected item on the secondary container',
    true,
    LightTheme.colors.secondaryContainer,
    LightTheme.colors.onSecondaryContainer,
    LightTheme.colors.onSecondaryContainer,
  ],
])(
  'renders %s',
  async (_label, selected, backgroundColor, titleColor, descriptionColor) => {
    await render(
      <ListItem
        title="First Item"
        description="Item description"
        selected={selected}
        testID={testID}
      />
    );

    expect(screen.getByTestId(testID)).toHaveStyle({ backgroundColor });
    expect(screen.getByText('First Item')).toHaveStyle({ color: titleColor });
    expect(screen.getByText('Item description')).toHaveStyle({
      color: descriptionColor,
    });
  }
);

it('announces a pressable item as a button', async () => {
  await render(<ListItem title="First Item" onPress={() => {}} />);

  expect(screen.getByRole('button', { name: 'First Item' })).toBeOnTheScreen();
});

it('does not give an item without onPress the button role', async () => {
  await render(<ListItem title="First Item" />);

  expect(screen.queryByRole('button')).not.toBeOnTheScreen();
});

it('announces a selected item to screen readers', async () => {
  await render(<ListItem title="First Item" onPress={() => {}} selected />);

  expect(screen.getByRole('button', { name: 'First Item' })).toBeSelected();
});

it('lets a caller override the role and the selected state', async () => {
  await render(
    <ListItem
      title="First Item"
      onPress={() => {}}
      selected
      role="link"
      aria-selected={false}
    />
  );

  expect(screen.getByRole('link', { name: 'First Item' })).not.toBeSelected();
});

it('puts a video thumbnail in the leading slot flush with the start edge', async () => {
  await render(
    <ListItem
      title="First Item"
      leading={
        <ListImage
          variant="video"
          source={{ uri: 'https://picsum.photos/228/128' }}
          testID="video-thumbnail"
        />
      }
    />
  );

  // The slot adds 16dp of leading space and the video takes it back
  expect(screen.getByTestId('video-thumbnail').parent).toHaveStyle({
    marginLeft: 16,
  });
  expect(screen.getByTestId('video-thumbnail')).toHaveStyle({
    marginLeft: -16,
  });
});

it('keeps a video thumbnail from the left render prop flush with the start edge', async () => {
  await render(
    <ListItem
      title="First Item"
      left={(props) => (
        <ListImage
          variant="video"
          style={props.style}
          source={{ uri: 'https://picsum.photos/228/128' }}
          testID="video-thumbnail"
        />
      )}
    />
  );

  expect(screen.getByTestId('video-thumbnail')).toHaveStyle({ marginLeft: 0 });
});

it.each([
  ['a disabled item', false],
  ['a selected, disabled item', true],
])(
  'renders the content of %s in onSurface at 38%% opacity',
  async (_label, selected) => {
    await render(
      <ListItem
        title="First Item"
        description="Item description"
        leading={<ListIcon icon="folder" />}
        trailing={<View testID="trailing" />}
        selected={selected}
        disabled
        testID={testID}
      />
    );

    expect(screen.getByText('First Item')).toHaveStyle({
      color: LightTheme.colors.onSurface,
    });
    expect(screen.getByText('Item description')).toHaveStyle({
      color: LightTheme.colors.onSurface,
    });
    expect(
      screen.getByText('folder', { includeHiddenElements: true })
    ).toHaveStyle({ color: LightTheme.colors.onSurface });
    // The row that holds the slots, title and description
    expect(screen.getByTestId('trailing').parent?.parent).toHaveStyle({
      opacity: 0.38,
    });
  }
);

it('does not fade the content of an enabled item', async () => {
  await render(
    <ListItem title="First Item" trailing={<View testID="trailing" />} />
  );

  expect(screen.getByTestId('trailing').parent?.parent).not.toHaveStyle({
    opacity: 0.38,
  });
});

it('puts a selected, disabled item on an onSurface layer at 38% opacity', async () => {
  await render(
    <ListItem title="First Item" selected disabled testID={testID} />
  );

  const item = screen.getByTestId(testID);

  expect(item).toHaveStyle({ backgroundColor: undefined });
  expect(item.children[0]).toHaveStyle({
    backgroundColor: LightTheme.colors.onSurface,
    opacity: 0.38,
  });
});

it('does not call onPress on a disabled item and announces it as disabled', async () => {
  const onPress = jest.fn<(event: GestureResponderEvent) => void>();
  await render(<ListItem title="First Item" onPress={onPress} disabled />);

  const item = screen.getByRole('button', { name: 'First Item' });

  expect(item).toBeDisabled();

  await userEvent.press(item);

  expect(onPress).not.toHaveBeenCalled();
});

describe('selected state on web', () => {
  it('announces a selected button item with aria-pressed, which fits a button', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<ListItem title="First Item" onPress={() => {}} selected />);

    const item = screen.getByRole('button', { name: 'First Item' });

    expect(item).toHaveProp('aria-pressed', true);
    expect(item).not.toBeSelected();
  });

  it('keeps aria-selected when a caller gives the item another role', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(
      <ListItem title="First Item" onPress={() => {}} selected role="option" />
    );

    const item = screen.getByRole('option', { name: 'First Item' });

    // React Native moves `aria-selected` into `accessibilityState`
    expect(item).toBeSelected();
    expect(item).not.toHaveProp('aria-pressed');
  });
});
