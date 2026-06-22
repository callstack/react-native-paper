import { expect, it } from '@jest/globals';

import { render } from '../../../test-utils';
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
