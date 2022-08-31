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
  inputFontVariant: {
    fontVariant: ['small-caps'],
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

it('renders flat input with custom font variant', () => {
  const { getByTestId } = render(<TextInput style={style.inputFontVariant} />);

  expect(getByTestId('text-input-flat').props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ fontVariant: ['small-caps'] }),
    ])
  );
});

it('renders outlined input with custom font variant', () => {
  const { getByTestId } = render(
    <TextInput mode="outlined" style={style.inputFontVariant} />
  );

  expect(getByTestId('text-input-outlined').props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ fontVariant: ['small-caps'] }),
    ])
  );
});

it('renders input placeholder initially with an empty space character', () => {
  const { getByTestId } = render(
    <TextInput multiline label="Multiline input" />
  );

  expect(getByTestId('text-input-flat').props.placeholder).toBe(' ');
});

describe('maxFontSizeMultiplier', () => {
  const createInput = (type, maxFontSizeMultiplier) => {
    return (
      <TextInput mode={type} maxFontSizeMultiplier={maxFontSizeMultiplier} />
    );
  };

  it('should have default value in flat input', () => {
    const { getByTestId } = render(createInput('flat'));

    expect(getByTestId('text-input-flat').props.maxFontSizeMultiplier).toBe(
      1.5
    );
  });

  it('should have default value in outlined input', () => {
    const { getByTestId } = render(createInput('outlined'));

    expect(getByTestId('text-input-outlined').props.maxFontSizeMultiplier).toBe(
      1.5
    );
  });

  it('should have correct passed value in flat input', () => {
    const { getByTestId } = render(createInput('flat', 2));

    expect(getByTestId('text-input-flat').props.maxFontSizeMultiplier).toBe(2);
  });

  it('should have correct passed value in outlined input', () => {
    const { getByTestId } = render(createInput('outlined', 2));

    expect(getByTestId('text-input-outlined').props.maxFontSizeMultiplier).toBe(
      2
    );
  });

  it('should have passed null value in flat input', () => {
    const { getByTestId } = render(createInput('flat', null));

    expect(getByTestId('text-input-flat').props.maxFontSizeMultiplier).toBe(
      null
    );
  });

  it('should have passed null value in outlined input', () => {
    const { getByTestId } = render(createInput('outlined', null));

    expect(getByTestId('text-input-outlined').props.maxFontSizeMultiplier).toBe(
      null
    );
  });
});
