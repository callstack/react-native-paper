import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import { DarkTheme, LightTheme } from '../../theme/schemes';
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

describe('ToggleButton.Row', () => {
  it('divides hitSlop between adjoining buttons, zeroing the shared edge', async () => {
    await render(
      <ToggleButton.Row value="a" onValueChange={() => {}}>
        <ToggleButton testID="first" icon="heart" value="a" />
        <ToggleButton testID="middle" icon="heart" value="b" />
        <ToggleButton testID="last" icon="heart" value="c" />
      </ToggleButton.Row>
    );

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('first').props.hitSlop).toEqual({
      top: 3,
      bottom: 3,
      left: 3,
      right: 0,
    });
    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('middle').props.hitSlop).toEqual({
      top: 3,
      bottom: 3,
      left: 0,
      right: 0,
    });
    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('last').props.hitSlop).toEqual({
      top: 3,
      bottom: 3,
      left: 0,
      right: 3,
    });
  });

  it('keeps the usual hitSlop for a lone button in a row', async () => {
    await render(
      <ToggleButton.Row value="a" onValueChange={() => {}}>
        <ToggleButton testID="only" icon="heart" value="a" />
      </ToggleButton.Row>
    );

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('only').props.hitSlop).toEqual({
      top: 3,
      bottom: 3,
      left: 3,
      right: 3,
    });
  });

  it('gives a disabled button in a row no hitSlop of its own', async () => {
    await render(
      <ToggleButton.Row value="a" onValueChange={() => {}}>
        <ToggleButton testID="first" icon="heart" value="a" disabled />
        <ToggleButton testID="last" icon="heart" value="b" />
      </ToggleButton.Row>
    );

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('first').props.hitSlop).toBeUndefined();
  });

  it('lets a caller-supplied hitSlop win over the row default', async () => {
    const customHitSlop = { top: 2, bottom: 2, left: 2, right: 2 };

    await render(
      <ToggleButton.Row value="a" onValueChange={() => {}}>
        <ToggleButton
          testID="first"
          icon="heart"
          value="a"
          hitSlop={customHitSlop}
        />
        <ToggleButton testID="last" icon="heart" value="b" />
      </ToggleButton.Row>
    );

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('first').props.hitSlop).toBe(customHitSlop);
  });

  it('squares off the corners shared with a neighbour', async () => {
    await render(
      <ToggleButton.Row value="a" onValueChange={() => {}}>
        <ToggleButton testID="first" icon="heart" value="a" />
        <ToggleButton testID="middle" icon="heart" value="b" />
        <ToggleButton testID="last" icon="heart" value="c" />
      </ToggleButton.Row>
    );

    expect(screen.getByTestId('first')).toHaveStyle({
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    });
    expect(screen.getByTestId('middle')).toHaveStyle({ borderRadius: 0 });
    expect(screen.getByTestId('last')).toHaveStyle({
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    });
  });
});

describe('getToggleButtonColor', () => {
  it('should return correct color when checked and theme version 3', () => {
    expect(getToggleButtonColor({ theme: LightTheme, checked: true })).toBe(
      LightTheme.colors.surfaceContainerHighest
    );
  });

  it('should return correct color when checked and theme version 3, dark theme', () => {
    expect(getToggleButtonColor({ theme: DarkTheme, checked: true })).toBe(
      DarkTheme.colors.surfaceContainerHighest
    );
  });

  it('should return correct color when not checked', () => {
    expect(getToggleButtonColor({ theme: LightTheme, checked: false })).toBe(
      LightTheme.colors.surfaceContainer
    );
  });
});
