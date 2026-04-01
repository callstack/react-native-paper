import React from 'react';
import { StyleSheet } from 'react-native';

import { getLeftStyles, getRightStyles } from '../List/utils';
import Text from '../Typography/Text';

const styles = StyleSheet.create({
  leftItemV3: {
    marginLeft: 16,
    marginRight: 0,
    alignSelf: 'center',
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

it('returns styles for left item without description', () => {
  const style = getLeftStyles(false, null);
  expect(style).toStrictEqual({ ...styles.leftItemV3, marginVertical: 0 });
});

it('returns styles for left item w/ description', () => {
  const style = getLeftStyles(true, description);
  expect(style).toStrictEqual({
    ...styles.leftItemV3,
    alignSelf: 'flex-start',
  });
});

/**
 * ********************** getRightStyles ********************** *
 */

it('returns styles for right item without description', () => {
  const style = getRightStyles(false, null);
  expect(style).toStrictEqual({ ...styles.rightItemV3, marginVertical: 0 });
});

it('returns styles for right item w/ description', () => {
  const style = getRightStyles(true, description);
  expect(style).toStrictEqual({
    ...styles.rightItemV3,
    alignSelf: 'flex-start',
  });
});
