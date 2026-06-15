import { Animated } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
import ToggleButton from '../ToggleButton';
import { getToggleButtonColor } from '../ToggleButton/utils';

it('renders toggle button', () => {
  const tree = render(
    <ToggleButton status="checked" onPress={() => {}} icon="heart" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled toggle button', () => {
  const tree = render(
    <ToggleButton disabled value="toggle" status="checked" icon="heart" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked toggle button', () => {
  const tree = render(
    <ToggleButton disabled status="unchecked" icon="heart" />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('getToggleButtonColor', () => {
  it('should return correct color when checked and theme version 3', () => {
    expect(getToggleButtonColor({ theme: getTheme(), checked: true })).toBe(
      getTheme().colors.surfaceContainerHighest
    );
  });

  it('should return correct color when checked and theme version 3, dark theme', () => {
    expect(getToggleButtonColor({ theme: getTheme(true), checked: true })).toBe(
      getTheme(true).colors.surfaceContainerHighest
    );
  });

  it('should return correct color when not checked', () => {
    expect(getToggleButtonColor({ theme: getTheme(), checked: false })).toBe(
      getTheme().colors.surfaceContainer
    );
  });
});

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <ToggleButton
      disabled
      status="unchecked"
      icon="heart"
      testID="toggle-button"
      style={[{ transform: [{ scale: value }] }]}
    />
  );
  expect(getByTestId('toggle-button-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(getByTestId('toggle-button-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
