import { View } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import ToggleButton from '../ToggleButton';
import { getToggleButtonColor } from '../ToggleButton/utils';

it('renders toggle button', async () => {
  const tree = (
    await render(
      <ToggleButton status="checked" onPress={() => {}} icon="heart" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled toggle button', async () => {
  const tree = (
    await render(
      <ToggleButton disabled value="toggle" status="checked" icon="heart" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked toggle button', async () => {
  const tree = (
    await render(<ToggleButton disabled status="unchecked" icon="heart" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders row buttons with segmented styling through context', async () => {
  await render(
    <ToggleButton.Row value="left" onValueChange={() => {}}>
      <View>
        <ToggleButton
          icon="format-align-left"
          value="left"
          testID="wrapped-toggle"
        />
      </View>
      <ToggleButton
        icon="format-align-right"
        value="right"
        testID="direct-toggle"
      />
    </ToggleButton.Row>
  );

  expect(screen.getByTestId('wrapped-toggle-container')).toHaveStyle({
    borderRadius: 0,
  });
  expect(screen.getByTestId('direct-toggle-container')).toHaveStyle({
    borderRadius: 0,
  });
});

it('applies the same selection color in a row as standalone (no row-specific override)', async () => {
  await render(
    <ToggleButton.Row value="left" onValueChange={() => {}}>
      <ToggleButton icon="format-align-left" value="left" testID="selected" />
      <ToggleButton
        icon="format-align-right"
        value="right"
        testID="unselected"
      />
    </ToggleButton.Row>
  );

  expect(screen.getByTestId('selected-container')).toHaveStyle({
    backgroundColor: getTheme().colors.surfaceContainerHighest,
  });
  expect(screen.getByTestId('unselected-container')).toHaveStyle({
    backgroundColor: getTheme().colors.surfaceContainer,
  });
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
