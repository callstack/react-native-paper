import type { GestureResponderEvent } from 'react-native';

import {
  beforeAll,
  describe,
  expect,
  it,
  jest as mockJest,
} from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';

describe('RadioButton', () => {
  describe('on default platform', () => {
    beforeAll(() => {
      mockJest.mock('react-native', () => {
        const RN =
          mockJest.requireActual<typeof import('react-native')>('react-native');

        return {
          ...RN,
          Platform: {
            ...RN.Platform,
            select: (objs: { default: object }) => objs.default,
          },
        };
      });
    });

    it('renders properly', async () => {
      const tree = (await render(<RadioButton value="first" />)).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('on ios platform', () => {
    beforeAll(() => {
      mockJest.mock('react-native', () => {
        const RN =
          mockJest.requireActual<typeof import('react-native')>('react-native');

        return {
          ...RN,
          Platform: {
            ...RN.Platform,
            select: (objs: { ios: object }) => objs.ios,
          },
        };
      });
    });

    it('renders properly', async () => {
      const tree = (await render(<RadioButton value="first" />)).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when RadioButton is wrapped by RadioButtonContext.Provider', () => {
    it('renders properly', async () => {
      const tree = (
        await render(
          <RadioButtonContext.Provider
            value={{ value: 'first', onValueChange: () => {} }}
          >
            <RadioButton value="first" />
          </RadioButtonContext.Provider>
        )
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('RadioButton with custom testID', () => {
    it('renders properly', async () => {
      const tree = (
        await render(<RadioButton value="first" testID={'custom:testID'} />)
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  // Both variants are reached through their own component, so neither depends on
  // which platform the file mocking `Platform.select` above runs on.
  describe.each([
    { label: 'RadioButton.Android', Button: RadioButton.Android },
    { label: 'RadioButton.IOS', Button: RadioButton.IOS },
  ])('$label', ({ Button }) => {
    it('calls onPress when pressed', async () => {
      const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      await render(<Button value="first" onPress={onPress} />);

      await userEvent.press(screen.getByRole('radio'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('is a disabled control and ignores presses when disabled', async () => {
      const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      await render(<Button value="first" disabled onPress={onPress} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeDisabled();

      await userEvent.press(radio);

      expect(onPress).not.toHaveBeenCalled();
    });

    it('keeps the same element when it gets disabled', async () => {
      const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      const { rerender } = await render(
        <Button value="first" onPress={onPress} />
      );

      const enabled = screen.getByRole('radio');

      // a disabled radio that switched element would drop focus and any state a
      // child holds, so `disabled` has to be what switches it off
      await rerender(<Button value="first" disabled onPress={onPress} />);

      const disabled = screen.getByRole('radio');

      expect(disabled).toBeDisabled();
      expect(disabled).toBe(enabled);
    });
  });
});
