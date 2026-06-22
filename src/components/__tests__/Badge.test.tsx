import { expect, it } from '@jest/globals';

import { render } from '../../test-utils';
import { red500 } from '../../theme/colors';
import Badge from '../Badge';

it('renders badge', async () => {
  const tree = (await render(<Badge />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge with content', async () => {
  const tree = (await render(<Badge>3</Badge>)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different size', async () => {
  const tree = (await render(<Badge size={12}>3</Badge>)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge as hidden', async () => {
  const tree = (
    await render(
      <Badge visible={false} size={12}>
        3
      </Badge>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different color', async () => {
  const tree = (
    await render(<Badge style={{ backgroundColor: red500 }}>3</Badge>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
