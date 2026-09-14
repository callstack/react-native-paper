import { expect, it } from '@jest/globals';

import { defaultThemes } from '../../core/theming';
import { render, screen } from '../../test-utils';
import Divider from '../Divider';

const hidden = { includeHiddenElements: true };

it('renders divider', async () => {
  const tree = (await render(<Divider />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders vertical divider', async () => {
  const tree = (await render(<Divider orientation="vertical" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders 1dp thick horizontal line by default', async () => {
  await render(<Divider testID="divider" />);

  expect(screen.getByTestId('divider', hidden)).toHaveStyle({
    height: 1,
    backgroundColor: defaultThemes.light.colors.outlineVariant,
  });
});

it('renders 1dp thick line stretched to the parent when vertical', async () => {
  await render(<Divider orientation="vertical" testID="divider" />);

  expect(screen.getByTestId('divider', hidden)).toHaveStyle({
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: defaultThemes.light.colors.outlineVariant,
  });
  expect(screen.getByTestId('divider', hidden)).not.toHaveStyle({ height: 1 });
});

it('insets the start edge in a writing direction aware way', async () => {
  await render(<Divider startInset testID="divider" />);

  const divider = screen.getByTestId('divider', hidden);

  expect(divider).toHaveStyle({ marginStart: 16 });
  expect(divider).not.toHaveStyle({ marginLeft: 16 });
});

it('insets both edges', async () => {
  await render(<Divider horizontalInset testID="divider" />);

  const divider = screen.getByTestId('divider', hidden);

  expect(divider).toHaveStyle({ marginStart: 16, marginEnd: 16 });
  expect(divider).not.toHaveStyle({ marginLeft: 16 });
  expect(divider).not.toHaveStyle({ marginRight: 16 });
});

it('insets the leading end of a vertical divider', async () => {
  await render(<Divider orientation="vertical" startInset testID="divider" />);

  const divider = screen.getByTestId('divider', hidden);

  expect(divider).toHaveStyle({ marginTop: 16 });
  expect(divider).not.toHaveStyle({ marginStart: 16 });
});

it('insets both ends of a vertical divider', async () => {
  await render(
    <Divider orientation="vertical" horizontalInset testID="divider" />
  );

  expect(screen.getByTestId('divider', hidden)).toHaveStyle({
    marginTop: 16,
    marginBottom: 16,
  });
});

it('applies custom styles over the defaults', async () => {
  await render(<Divider style={{ height: 4 }} testID="divider" />);

  expect(screen.getByTestId('divider', hidden)).toHaveStyle({ height: 4 });
});

it('stays out of the accessibility tree', async () => {
  await render(<Divider testID="divider" />);

  expect(screen.queryByTestId('divider')).toBeNull();
  expect(screen.getByTestId('divider', hidden)).toHaveProp('aria-hidden', true);
});

it('can be exposed as a separator', async () => {
  await render(<Divider accessible aria-hidden={false} role="separator" />);

  expect(screen.getByRole('separator')).toBeOnTheScreen();
});
