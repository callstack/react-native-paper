import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
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
