import {
  beforeAll,
  describe,
  expect,
  it,
  jest as mockJest,
} from '@jest/globals';

import { render } from '../../../test-utils';
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
});
