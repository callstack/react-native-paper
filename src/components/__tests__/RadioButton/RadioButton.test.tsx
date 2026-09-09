import {
  beforeAll,
  describe,
  expect,
  it,
  jest as mockJest,
} from '@jest/globals';

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

  describe('hitSlop', () => {
    it('expands up to the 48dp minimum when enabled', async () => {
      await render(<RadioButton testID="radio" value="first" />);

      // (48 - 40) / 2 on every side
      // eslint-disable-next-line no-restricted-syntax
      expect(screen.getByTestId('radio').props.hitSlop).toEqual({
        top: 4,
        bottom: 4,
        left: 4,
        right: 4,
      });
    });

    it('gives a disabled RadioButton no hitSlop of its own', async () => {
      await render(<RadioButton testID="radio" value="first" disabled />);

      // eslint-disable-next-line no-restricted-syntax
      expect(screen.getByTestId('radio').props.hitSlop).toBeUndefined();
    });
  });
});
