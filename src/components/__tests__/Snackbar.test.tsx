import { StyleSheet, Text, View } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { render } from '../../test-utils';
import { red200, white } from '../../theme/colors';
import Snackbar from '../Snackbar';

const styles = StyleSheet.create({
  snackContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconView: {
    backgroundColor: red200,
    padding: 15,
  },
  text: { color: white, marginLeft: 10, flexWrap: 'wrap', flexShrink: 1 },
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

it('renders snackbar with content', async () => {
  const tree = (
    await render(
      <Snackbar visible onDismiss={jest.fn()}>
        Snackbar content
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible snackbar with content wrapper but no actual content', async () => {
  const tree = (
    await render(
      <Snackbar visible={false} onDismiss={jest.fn()}>
        Snackbar content
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with Text as a child', async () => {
  const tree = (
    await render(
      <Snackbar visible onDismiss={jest.fn()}>
        <Text>Snackbar content</Text>
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with action button', async () => {
  const tree = (
    await render(
      <Snackbar
        visible
        onDismiss={() => {}}
        action={{ label: 'Undo', onPress: jest.fn() }}
      >
        Snackbar content
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with View & Text as a child', async () => {
  const tree = (
    await render(
      <Snackbar visible onDismiss={jest.fn()}>
        <View style={styles.snackContent}>
          <View style={styles.iconView} />
          <Text style={styles.text}>
            Error Message which is veryyyyyyyyyyyy longggggggg Error Message
            which is veryyyyyyyyyyyy longggggggg
          </Text>
        </View>
      </Snackbar>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
