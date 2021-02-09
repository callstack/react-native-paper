import * as React from 'react';
import Dropdown from '../Dropdown';
import Text from '../Typography/Text';
import {
  fireEvent,
  render,
  waitForElement,
} from 'react-native-testing-library';
import Provider from '../../core/Provider';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

jest.useRealTimers();

it('renders an empty dropdown', () => {
  const { toJSON } = render(
    <Provider>
      <Dropdown placeholder="Nothing here!" />
    </Provider>
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders dropdown with multiple options', () => {
  const { toJSON } = render(
    <Provider>
      <Dropdown>
        <Dropdown.Option key={1} value={1} label="Option 1" />
        <Dropdown.Option key={2} value={2} label="Option 2" />
      </Dropdown>
    </Provider>
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders dropdown with custom content', () => {
  const { toJSON } = render(
    <Provider>
      <Dropdown renderNoneOption={(props) => <Text {...props}>None</Text>}>
        <Dropdown.Option
          key={1}
          value={1}
          label="Option 1"
          render={(props) => <Text {...props}>Custom Text</Text>}
        />
      </Dropdown>
    </Provider>
  );

  expect(toJSON()).toMatchSnapshot();
});

it('throws an error when Dropdown.Option is used outside dropdown', () => {
  const render = () => {
    render(<Dropdown.Option key={1} value={1} label="Option1" />);
  };

  expect(render).toThrowErrorMatchingSnapshot();
});

it('renders in floating mode', () => {
  const { toJSON } = render(
    <Provider>
      <Dropdown mode="floating">
        <Dropdown.Option key={1} value={1} label="Option 1" />
      </Dropdown>
    </Provider>
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders in modal mode', () => {
  const { toJSON } = render(
    <Provider>
      <Dropdown mode="modal">
        <Dropdown.Option key={1} value={1} label="Option 1" />
      </Dropdown>
    </Provider>
  );

  expect(toJSON()).toMatchSnapshot();
});

it('triggers onSelect callback', async () => {
  const onSelect = jest.fn();
  const value = 1;
  const dropdownTestID = 'dropdown';
  const optionTestID = 'option';

  const { getByTestId, toJSON } = render(
    <Provider>
      <Dropdown testID={dropdownTestID} mode="modal" onSelect={onSelect}>
        <Dropdown.Option
          testID={optionTestID}
          key={1}
          value={value}
          label="Option 1"
        />
      </Dropdown>
    </Provider>
  );

  const dropdown = getByTestId(dropdownTestID);

  fireEvent(dropdown.findByType(TouchableRipple), 'press');
  await waitForElement(() => getByTestId(optionTestID));

  expect(toJSON()).toMatchSnapshot();
});
