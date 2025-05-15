import React from 'react';
import { StyleSheet } from 'react-native';

import { getLeftStyles, getRightStyles } from '../List/utils';
import Text from '../Typography/Text';

const styles = StyleSheet.create({
  leftItem: {
    marginLeft: 16,
    marginRight: 0,
    alignSelf: 'center',
  },
  rightItem: {
    marginLeft: 16,
    marginRight: 0,
    alignSelf: 'center',
  },
});

const description = <Text>Test</Text>;

/**
 * ********************** getLeftStyles ********************** *
 */

it('returns styles for left item without description', () => {
  const style = getLeftStyles(false, null);
  expect(style).toStrictEqual({ ...styles.leftItem, marginVertical: 0 });
});

it('returns styles for left item w/ desctiption', () => {
  const style = getLeftStyles(true, description);
  expect(style).toStrictEqual({
    ...styles.leftItem,
    alignSelf: 'flex-start',
  });
});

/**
 * ********************** getRightStyles ********************** *
 */

it('returns styles for right item without description', () => {
  const style = getRightStyles(false, null);
  expect(style).toStrictEqual({ ...styles.rightItem, marginVertical: 0 });
});

it('returns styles for right item w/ desctiption', () => {
  const style = getRightStyles(true, description);
  expect(style).toStrictEqual({
    ...styles.rightItem,
    alignSelf: 'flex-start',
  });
});
