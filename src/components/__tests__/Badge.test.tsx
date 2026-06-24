import { expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
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

it('renders badge as hidden', async () => {
  const tree = (await render(<Badge visible={false}>3</Badge>)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders badge in different color', async () => {
  const tree = (
    await render(<Badge style={{ backgroundColor: red500 }}>3</Badge>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('applies small dot dimensions when no children', async () => {
  await render(<Badge testID="badge" />);

  expect(screen.getByTestId('badge')).toHaveStyle({
    height: 6,
    minWidth: 6,
    borderRadius: 9999,
  });
});

it('applies large pill dimensions when children are present', async () => {
  await render(<Badge testID="badge">3</Badge>);

  expect(screen.getByTestId('badge')).toHaveStyle({
    height: 16,
    minWidth: 16,
    paddingHorizontal: 4,
    fontSize: 11,
    lineHeight: 16,
    borderRadius: 9999,
  });
});

it('clips oversized label via maxWidth', async () => {
  await render(<Badge testID="badge">9999999</Badge>);

  expect(screen.getByTestId('badge')).toHaveStyle({ maxWidth: 34 });
});

it('does not apply typography or padding to dot badge', async () => {
  await render(<Badge testID="badge" />);

  expect(screen.getByTestId('badge')).not.toHaveStyle({ paddingHorizontal: 4 });
  expect(screen.getByTestId('badge')).not.toHaveStyle({ fontSize: 11 });
});
