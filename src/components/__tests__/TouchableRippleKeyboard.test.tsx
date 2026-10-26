import { Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen } from '../../test-utils';
import type TouchableRippleType from '../TouchableRipple/TouchableRipple';

// The web variant, required with its extension: a bare specifier resolves to
// `TouchableRipple.native.tsx` under the jest preset.
const TouchableRipple: typeof TouchableRippleType =
  require('../TouchableRipple/TouchableRipple.tsx').default;

const pressSpace = async (
  key: string,
  { click = jest.fn(), preventDefault = jest.fn() } = {}
) => {
  const target = screen.getByTestId('touchable');
  await fireEvent(target, 'keyDown', { key, preventDefault });
  await fireEvent(target, 'keyUp', { key, currentTarget: { click } });
  return { click, preventDefault };
};

describe('TouchableRipple on web', () => {
  it('clicks a radio on Space and keeps the page from scrolling', async () => {
    await render(
      <TouchableRipple role="radio" onPress={() => {}} testID="touchable">
        <Text>Walking</Text>
      </TouchableRipple>
    );

    const { click, preventDefault } = await pressSpace(' ');

    expect(preventDefault).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });

  it('ignores keys other than Space', async () => {
    await render(
      <TouchableRipple role="checkbox" onPress={() => {}} testID="touchable">
        <Text>Bold</Text>
      </TouchableRipple>
    );

    const { click, preventDefault } = await pressSpace('a');

    expect(preventDefault).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
  });

  it('leaves Space on a button to react-native-web', async () => {
    await render(
      <TouchableRipple role="button" onPress={() => {}} testID="touchable">
        <Text>Save</Text>
      </TouchableRipple>
    );

    const { click, preventDefault } = await pressSpace(' ');

    expect(preventDefault).not.toHaveBeenCalled();
    expect(click).not.toHaveBeenCalled();
  });

  it('does not click a disabled checkbox', async () => {
    await render(
      <TouchableRipple
        role="checkbox"
        disabled
        onPress={() => {}}
        testID="touchable"
      >
        <Text>Bold</Text>
      </TouchableRipple>
    );

    const { click } = await pressSpace(' ');

    expect(click).not.toHaveBeenCalled();
  });

  it('still calls the caller key handlers', async () => {
    const onKeyDown = jest.fn();
    const onKeyUp = jest.fn();
    await render(
      <TouchableRipple
        role="radio"
        onPress={() => {}}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        testID="touchable"
      >
        <Text>Walking</Text>
      </TouchableRipple>
    );

    await pressSpace(' ');

    expect(onKeyDown).toHaveBeenCalled();
    expect(onKeyUp).toHaveBeenCalled();
  });
});
