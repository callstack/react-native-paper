import React from 'react';

import { render } from '@testing-library/react-native';

import RadioButton from '../../RadioButton';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';

describe('RadioButton', () => {
  describe('on default platform', () => {
    beforeAll(() => {
      jest.mock('react-native', () => {
        const RN = jest.requireActual('react-native');

        RN.Platform = () => ({
          select: (objs: { default: object }) => objs.default,
        });

        return RN;
      });
    });

    it('renders properly', () => {
      const tree = render(<RadioButton value="first" />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('on ios platform', () => {
    beforeAll(() => {
      jest.mock('react-native', () => {
        const RN = jest.requireActual('react-native');

        RN.Platform = () => ({
          select: (objs: { ios: object }) => objs.ios,
        });

        return RN;
      });
    });

    it('renders properly', () => {
      const tree = render(<RadioButton value="first" />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when RadioButton is wrapped by RadioButtonContext.Provider', () => {
    it('renders properly', () => {
      const tree = render(
        <RadioButtonContext.Provider
          value={{ value: 'first', onValueChange: () => {} }}
        >
          <RadioButton value="first" />
        </RadioButtonContext.Provider>
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('RadioButton with custom testID', () => {
    it('renders properly', () => {
      const tree = render(
        <RadioButton value="first" testID={'custom:testID'} />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
