/// <reference types="@testing-library/jest-native" />

import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { MD3Colors } from '../../styles/themes/v3/tokens';
import AnimatedFAB from '../FAB/AnimatedFAB';

const styles = StyleSheet.create({
  background: {
    backgroundColor: MD3Colors.tertiary50,
  },
});

it('renders animated fab', () => {
  const tree = render(
    <AnimatedFAB onPress={() => {}} label="" extended={false} icon="plus" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated fab with label on the right by default', () => {
  const tree = render(
    <AnimatedFAB label="text" extended onPress={() => {}} icon="plus" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated fab with label on the left', () => {
  const tree = render(
    <AnimatedFAB
      label="text"
      extended
      animateFrom="left"
      onPress={() => {}}
      icon="plus"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated fab with only transparent container', () => {
  const { getByTestId } = render(
    <AnimatedFAB
      label="text"
      animateFrom="left"
      onPress={() => {}}
      icon="plus"
      testID="animated-fab"
      extended={false}
      style={styles.background}
    />
  );
  expect(getByTestId('animated-fab-container')).toHaveStyle({
    backgroundColor: 'transparent',
  });
});

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <AnimatedFAB
      label="text"
      icon="plus"
      testID="animated-fab"
      extended={false}
      style={[{ transform: [{ scale: value }] }]}
    />
  );
  expect(getByTestId('animated-fab-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  jest.advanceTimersByTime(200);

  expect(getByTestId('animated-fab-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

it('renders FAB without uppercase styling if uppercase prop is falsy', () => {
  const { getByTestId } = render(
    <AnimatedFAB
      label="text"
      animateFrom="left"
      onPress={() => {}}
      icon="plus"
      testID="animated-fab"
      style={styles.background}
      extended={false}
      uppercase={false}
    />
  );

  expect(getByTestId('animated-fab-text')).not.toHaveStyle({
    textTransform: 'uppercase',
  });
});

it('renders FAB with uppercase styling if uppercase prop is truthy', () => {
  const { getByTestId } = render(
    <AnimatedFAB
      label="text"
      animateFrom="left"
      onPress={() => {}}
      icon="plus"
      testID="animated-fab"
      style={styles.background}
      extended={false}
      uppercase
    />
  );

  expect(getByTestId('animated-fab-text')).toHaveStyle({
    textTransform: 'uppercase',
  });
});

it('renders correct elevation value for shadow views', () => {
  const { getByTestId } = render(
    <AnimatedFAB
      extended
      label="text"
      animateFrom="left"
      onPress={() => {}}
      icon="plus"
      testID="animated-fab"
    />
  );

  expect(getByTestId('animated-fab-shadow')).toHaveStyle({ elevation: 3 });
  expect(getByTestId('animated-fab-extended-shadow')).toHaveStyle({
    elevation: 3,
  });
});

describe('AnimatedFAB events', () => {
  it('onPress passes event', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AnimatedFAB extended icon="plus" onPress={onPress} label="Add items" />
    );

    act(() => {
      fireEvent(getByTestId('animated-fab'), 'onPress', { key: 'value' });
    });

    expect(onPress).toHaveBeenCalledWith({ key: 'value' });
  });

  it('onLongPress passes event', () => {
    const onLongPress = jest.fn();
    const { getByTestId } = render(
      <AnimatedFAB
        extended
        icon="plus"
        onLongPress={onLongPress}
        label="Add items"
      />
    );

    act(() => {
      fireEvent(getByTestId('animated-fab'), 'onLongPress', { key: 'value' });
    });

    expect(onLongPress).toHaveBeenCalledWith({ key: 'value' });
  });
});
