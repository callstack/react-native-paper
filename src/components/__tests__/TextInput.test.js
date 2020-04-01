import * as React from 'react';
import { render } from 'react-native-testing-library';
import TextInput from '../TextInput/TextInput';

it('renders on TextInput', () => {
 const { toJSON } = render(<TextInput testID="input" />);
 expect( toJSON() ).toMatchSnapshot();
});

it('should be find TextInput component by testID', () => {
 const { getByTestId } = render(<TextInput testID="input" />);
 const component = getByTestId('input');
 expect(component).toBeTruthy();
});