import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import renderer from 'react-test-renderer';

import { red200, white } from '../../styles/themes/v2/colors';
import Snackbar from '../Snackbar.tsx';

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

// Make sure any animation finishes before checking the snapshot results
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Animated.timing = (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      callback && callback({ finished: true });
    },
  });

  return RN;
});

it('renders snackbar with content', () => {
  const tree = renderer
    .create(
      <Snackbar visible onDismiss={jest.fn()}>
        Snackbar content
      </Snackbar>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible snackbar with content wrapper but no actual content', () => {
  const tree = renderer
    .create(
      <Snackbar visible={false} onDismiss={jest.fn()}>
        Snackbar content
      </Snackbar>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with Text as a child', () => {
  const tree = renderer
    .create(
      <Snackbar visible onDismiss={jest.fn()}>
        <Text>Snackbar content</Text>
      </Snackbar>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with action button', () => {
  const tree = renderer
    .create(
      <Snackbar
        visible
        onDismiss={() => {}}
        action={{ label: 'Undo', onPress: jest.fn() }}
      >
        Snackbar content
      </Snackbar>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with View & Text as a child', () => {
  const tree = renderer
    .create(
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
    .toJSON();

  expect(tree).toMatchSnapshot();
});
