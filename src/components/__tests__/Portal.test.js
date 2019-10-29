import * as React from 'react';
import { render, waitForElement } from 'react-native-testing-library';
import { Text } from 'react-native';
import Portal from '../Portal/Portal.tsx';

it('renders portal with siblings', async () => {
  const { toJSON, getByTestId } = render(
    <Portal.Host>
      <Text>Outside content</Text>
      <Portal>
        <Text testID="content">Portal content</Text>
      </Portal>
    </Portal.Host>
  );

  await waitForElement(() => getByTestId('content'));

  expect(toJSON()).toMatchSnapshot();
});
