import type * as React from 'react';
import { Pressable } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';

type RadioProps = {
  value: string;
  status?: 'checked' | 'unchecked';
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

// `RadioButton.Item` is a row: it wraps a radio of its own, so it exposes two
// radio nodes and the queries below take the first one, which is the row. The
// other two variants render a single node, which makes it the row as well.
// `Item` names its row, hence the label only it takes.
const radios: {
  label: string;
  Radio: (props: RadioProps) => React.ReactElement;
}[] = [
  {
    label: 'RadioButton.Android',
    Radio: (props) => <RadioButton.Android {...props} />,
  },
  {
    label: 'RadioButton.IOS',
    Radio: (props) => <RadioButton.IOS {...props} />,
  },
  {
    label: 'RadioButton.Item',
    Radio: (props) => <RadioButton.Item label="First" {...props} />,
  },
];

const getRow = () => screen.getAllByRole('radio')[0];

describe.each(radios)('$label', ({ Radio }) => {
  // A radio with no `onPress` and no `RadioButton.Group` has nothing to call, so
  // it must not claim the touch: whatever wraps it is what the user is pressing.
  it('lets a press reach the row it sits in, and stays an enabled selected radio', async () => {
    const onRowPress = jest.fn<(e: GestureResponderEvent) => void>();
    await render(
      <Pressable onPress={onRowPress}>
        <Radio value="first" status="checked" />
      </Pressable>
    );

    const radio = getRow();

    await userEvent.press(radio);

    expect(onRowPress).toHaveBeenCalledTimes(1);
    // still a radio a screen reader reports as selected, and being read only is
    // not the same as being unusable
    expect(radio).toBeChecked();
    expect(radio).not.toBeDisabled();
  });

  it('is a disabled control when disabled', async () => {
    await render(<Radio value="first" disabled />);

    expect(getRow()).toBeDisabled();
  });

  it('notifies the group it belongs to', async () => {
    const onValueChange = jest.fn<(value: string) => void>();
    await render(
      <RadioButton.Group onValueChange={onValueChange} value="second">
        <Radio value="first" />
      </RadioButton.Group>
    );

    await userEvent.press(getRow());

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('first');
  });

  it('calls its own onPress', async () => {
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await render(<Radio value="first" onPress={onPress} />);

    await userEvent.press(getRow());

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
