import * as React from 'react';
import { Animated } from 'react-native';

import { render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { tokens } from '../../styles/themes/v3/tokens';
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

it('render toggle button with custom ripple color', () => {
  const { getByTestId } = render(
    <ToggleButton
      disabled
      value="toggle"
      status="checked"
      icon="heart"
      testID="toggle-button"
      rippleColor="purple"
    />
  );

  const iconContainer = getByTestId('toggle-button-container').props.children;
  expect(iconContainer.props.rippleColor).toBe('purple');
});

describe('getToggleButtonColor', () => {
  it('should return correct color when checked and theme version 3', () => {
    expect(getToggleButtonColor({ theme: getTheme(), checked: true })).toBe(
      color(getTheme().colors.onSecondaryContainer)
        .alpha(tokens.md.ref.opacity.level2)
        .rgb()
        .string()
    );
  });

  it('should return correct color when checked and theme version 3, dark theme', () => {
    expect(getToggleButtonColor({ theme: getTheme(true), checked: true })).toBe(
      color(getTheme(true).colors.onSecondaryContainer)
        .alpha(tokens.md.ref.opacity.level2)
        .rgb()
        .string()
    );
  });

  it('should return correct color when checked and theme version 2', () => {
    expect(
      getToggleButtonColor({ theme: getTheme(false, false), checked: true })
    ).toBe('rgba(0, 0, 0, .08)');
  });

  it('should return correct color when checked and theme version 2, dark theme', () => {
    expect(
      getToggleButtonColor({ theme: getTheme(true, false), checked: true })
    ).toBe('rgba(255, 255, 255, .12)');
  });

  it('should return transparent color when not checked', () => {
    expect(getToggleButtonColor({ theme: getTheme(), checked: false })).toBe(
      'transparent'
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

  jest.advanceTimersByTime(200);

  expect(getByTestId('toggle-button-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
