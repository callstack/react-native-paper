import React from 'react';
import renderer from 'react-test-renderer';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';
import RadioButton from '../../RadioButton/RadioButton';

describe('RadioButton', () => {
  afterEach(() => jest.resetModules());

  describe('on default platform', () => {
    beforeAll(() => {
      jest.mock('react-native', () => {
        const RN = jest.requireActual('react-native');

        RN.Platform = () => ({
          select: objs => objs.default,
        });

        return RN;
      });
    });

    it('renders properly', () => {
      const tree = renderer.create(<RadioButton value="first" />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('on ios platform', () => {
    beforeAll(() => {
      jest.mock('react-native', () => {
        const RN = jest.requireActual('react-native');

        RN.Platform = () => ({
          select: objs => objs.ios,
        });

        return RN;
      });
    });

    it('renders properly', () => {
      const tree = renderer.create(<RadioButton value="first" />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('when RadioButton is wrapped by RadioButtonContext.Provider', () => {
    it('renders properly', () => {
      const tree = renderer
        .create(
          <RadioButtonContext.Provider value="first" onValueChange={() => {}}>
            <RadioButton value="first" />
          </RadioButtonContext.Provider>
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
