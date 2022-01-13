import * as React from 'react';
import { StyleSheet, Text, Platform } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';
import TextInput from '../TextInput/TextInput';
import { red500 } from '../../styles/colors';

const style = StyleSheet.create({
  inputStyle: {
    color: red500,
  },
  centered: {
    textAlign: 'center',
  },
  height: {
    height: 100,
  },
});

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
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
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
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
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
      style={style.centered}
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
      style={style.height}
      multiline
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies error state Outline TextInput', () => {
  const { getByTestId } = render(
    <TextInput
      mode="outlined"
      label="Outline Input with error"
      placeholder="Type Something"
      value={'Some test value'}
      error
    />
  );

  const outline = getByTestId('text-input-outline');
  expect(outline.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining({ borderWidth: 1 })])
  );
});

it('correctly applies focused state Outline TextInput', () => {
  const { getByTestId } = render(
    <TextInput
      mode="outlined"
      label="Outline Input with error"
      placeholder="Type Something"
      value={'Some test value'}
      error
    />
  );

  const outline = getByTestId('text-input-outline');
  expect(outline.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining({ borderWidth: 1 })])
  );

  fireEvent(getByTestId('text-input-outlined'), 'focus');

  expect(outline.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining({ borderWidth: 2 })])
  );
});

it('contains patch spacing for flat input when ios and multiline', () => {
  Platform.OS = 'ios';
  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      multiline
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
    />
  );
  expect(() => getByTestId('patch-container')).not.toThrow();
});

it('correctly applies a component as the text label', () => {
  const { toJSON } = render(
    <TextInput
      label={<Text style={style.inputStyle}>Flat input</Text>}
      placeholder="Type something"
      value={'Some test value'}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});
