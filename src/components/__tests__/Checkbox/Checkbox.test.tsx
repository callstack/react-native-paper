import { expect, it } from '@jest/globals';

import { render, screen } from '../../../test-utils';
import Checkbox from '../../Checkbox';

it('renders checked Checkbox with onPress', async () => {
  const tree = (
    await render(<Checkbox status="checked" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with onPress', async () => {
  const tree = (
    await render(<Checkbox status="unchecked" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox', async () => {
  const tree = (
    await render(<Checkbox status="indeterminate" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked Checkbox with color', async () => {
  const tree = (
    await render(<Checkbox status="checked" color="red" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with color', async () => {
  const tree = (
    await render(<Checkbox status="checked" color="red" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox with color', async () => {
  const tree = (
    await render(<Checkbox status="indeterminate" color="red" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders Checkbox with custom testID', async () => {
  const tree = (
    await render(<Checkbox status="checked" testID={'custom:testID'} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('expands hitSlop up to the 48dp minimum when enabled', async () => {
  await render(<Checkbox testID="checkbox" status="unchecked" />);

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('checkbox').props.hitSlop).toEqual({
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
  });
});

it('gives a disabled Checkbox no hitSlop of its own', async () => {
  await render(<Checkbox testID="checkbox" status="unchecked" disabled />);

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('checkbox').props.hitSlop).toBeUndefined();
});
