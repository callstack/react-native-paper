import React from 'react';
import { StyleSheet } from 'react-native';

import { getLeftStyles, getRightStyles } from '../List/utils';
import Text from '../Typography/Text';

const styles = StyleSheet.create({
  leftItem: {
    marginLeft: 0,
    marginRight: 16,
  },
  leftItemV3: {
    marginLeft: 16,
    marginRight: 0,
    alignSelf: 'center',
  },
  rightItem: {
    marginRight: 0,
  },
  rightItemV3: {
    marginLeft: 16,
    marginRight: 0,
    alignSelf: 'center',
  },
});

const description = <Text>Test</Text>;

/**
 * ********************** getLeftStyles ********************** *
 */

it('returns styles for left item without description for V2', () => {
  const style = getLeftStyles(false, null, false);
  expect(style).toStrictEqual({ ...styles.leftItem, marginVertical: 0 });
});

it('returns styles for left item w/ desctiption for V2', () => {
  const style = getLeftStyles(false, description, false);
  expect(style).toStrictEqual(styles.leftItem);
});

it('returns styles for left item without description for V3', () => {
  const style = getLeftStyles(false, null, true);
  expect(style).toStrictEqual({ ...styles.leftItemV3, marginVertical: 0 });
});

it('returns styles for left item w/ desctiption for V3', () => {
  const style = getLeftStyles(true, description, true);
  expect(style).toStrictEqual({
    ...styles.leftItemV3,
    alignSelf: 'flex-start',
  });
});

/**
 * ********************** getRightStyles ********************** *
 */

it('returns styles for right item without description for V2', () => {
  const style = getRightStyles(false, null, false);
  expect(style).toStrictEqual({ ...styles.rightItem, marginVertical: 0 });
});

it('returns styles for right item w/ desctiption for V2', () => {
  const style = getRightStyles(false, description, false);
  expect(style).toStrictEqual(styles.rightItem);
});

it('returns styles for right item without description for V3', () => {
  const style = getRightStyles(false, null, true);
  expect(style).toStrictEqual({ ...styles.rightItemV3, marginVertical: 0 });
});

it('returns styles for right item w/ desctiption for V3', () => {
  const style = getRightStyles(true, description, true);
  expect(style).toStrictEqual({
    ...styles.rightItemV3,
    alignSelf: 'flex-start',
  });
});
