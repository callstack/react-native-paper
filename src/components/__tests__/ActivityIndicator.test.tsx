import { expect, it } from '@jest/globals';

import { render } from '../../test-utils';
import ActivityIndicator from '../ActivityIndicator';

it('renders indicator', async () => {
  const tree = (await render(<ActivityIndicator animating />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders hidden indicator', async () => {
  const tree = (
    await render(<ActivityIndicator animating={false} hidesWhenStopped />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large indicator', async () => {
  const tree = (await render(<ActivityIndicator size="large" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders colored indicator', async () => {
  const tree = (await render(<ActivityIndicator color="#FF0000" />)).toJSON();

  expect(tree).toMatchSnapshot();
});
