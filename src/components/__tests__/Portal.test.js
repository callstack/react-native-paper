/* @flow */

import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Text } from 'react-native';
import PortalHost from '../Portal/PortalHost';
import Portal from '../Portal/Portal';

it('renders portal with siblings', () => {
  const wrapper = shallow(
    <PortalHost>
      <Text>Outside content</Text>
      <Portal>
        <Text>Portal content</Text>
      </Portal>
    </PortalHost>
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});
