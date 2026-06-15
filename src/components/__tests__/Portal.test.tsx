import { Text } from 'react-native';

import { waitFor } from '@testing-library/react-native';

import { render } from '../../test-utils';
import Portal from '../Portal/Portal';

jest.useRealTimers();

it('renders portal with siblings', async () => {
  const { toJSON, getByTestId } = render(
    <Portal.Host>
      <Text>Outside content</Text>
      <Portal>
        <Text testID="content">Portal content</Text>
      </Portal>
    </Portal.Host>
  );

  await waitFor(() => getByTestId('content'));

  expect(toJSON()).toMatchSnapshot();
});
