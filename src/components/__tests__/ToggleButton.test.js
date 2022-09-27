import * as React from 'react';

import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import { tokens } from '../../styles/themes/v3/tokens';
import ToggleButton from '../ToggleButton';
import { getToggleButtonColor } from '../ToggleButton/utils';

it('renders toggle button', () => {
  const tree = renderer
    .create(<ToggleButton status="checked" onPress={() => {}} icon="heart" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled toggle button', () => {
  const tree = renderer
    .create(
      <ToggleButton
        disabled
        value="toggle"
        status="checked"
        onValueChange={() => {}}
        icon="heart"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked toggle button', () => {
  const tree = renderer
    .create(
      <ToggleButton
        disabled
        status="unchecked"
        onValueChange={() => {}}
        icon="heart"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
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
