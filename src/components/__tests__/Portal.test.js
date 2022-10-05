import * as React from 'react';
import { Text } from 'react-native';

import { render, waitFor } from '@testing-library/react-native';

import Portal from '../Portal/Portal.tsx';

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
