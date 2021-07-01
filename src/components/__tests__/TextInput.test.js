import * as React from 'react';
import { render } from 'react-native-testing-library';
import TextInput from '../TextInput/TextInput';

const affixTextValue = '/100';
it('correctly renders left-side icon adornment, and right-side affix adornment', () => {
  const { getByText, getByTestId, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
      left={
        <TextInput.Icon
          name="heart"
          onPress={() => {
            console.log('!@# press left');
          }}
        />
      }
      right={
        <TextInput.Affix
          text={affixTextValue}
          textStyle={{ color: '#FF0000' }}
        />
      }
    />
  );
  expect(() => getByText(affixTextValue)).not.toThrow();
  expect(() => getByTestId('left-icon-adornment')).not.toThrow();
  expect(() => getByTestId('right-affix-adornment')).not.toThrow();
  expect(toJSON()).toMatchSnapshot();
});

it('correctly renders left-side icon adornment, and right-side affix adornment ', () => {
  const { getByText, getByTestId, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
      left={
        <TextInput.Affix
          text={affixTextValue}
          textStyle={{ color: '#FF0000' }}
        />
      }
      right={
        <TextInput.Icon
          name="heart"
          onPress={() => {
            console.log('!@# press left');
          }}
        />
      }
    />
  );
  expect(() => getByText(affixTextValue)).not.toThrow();
  expect(() => getByTestId('right-icon-adornment')).not.toThrow();
  expect(() => getByTestId('left-affix-adornment')).not.toThrow();
  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies default textAlign based on default RTL', () => {
  const { toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies textAlign center', () => {
  const { toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      style={{ textAlign: 'center' }}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies height to multiline Outline TextInput', () => {
  const { toJSON } = render(
    <TextInput
      mode="outlined"
      label="Outline Input"
      placeholder="Type Something"
      value={'Some test value'}
      style={{ height: 100 }}
      multiline
    />
  );

  expect(toJSON()).toMatchSnapshot();
});
