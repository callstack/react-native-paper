import * as React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';
import TextInput from '../TextInput/TextInput';
import { areLabelsEqual } from '../TextInput/helpers';
import { blue500, red500 } from '../../styles/colors';

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

it('correctly compares labels when both are string', () => {
  expect(areLabelsEqual('Comments', 'Comments')).toBe(true);
  expect(areLabelsEqual('Comments', 'No Comment')).toBe(false);
});

it('correctly compares labels when one is string and one is a component', () => {
  expect(areLabelsEqual(<Text>Comments</Text>, 'Comments')).toBe(false);
});

it('correctly compares labels when both labels are falsy', () => {
  // We're treating all falsy values as equivalent
  expect(areLabelsEqual()).toBe(true);
  expect(areLabelsEqual(undefined, undefined)).toBe(true);
  expect(areLabelsEqual(null, null)).toBe(true);
  expect(areLabelsEqual(undefined, '')).toBe(true);
  expect(areLabelsEqual(null, '')).toBe(true);
  expect(areLabelsEqual(undefined, null)).toBe(true);
});

it('correctly compares labels when both labels are components', () => {
  // Same component; same props, same children
  const component1 = <Text>Comments</Text>;

  let component2 = <Text>Comments</Text>;
  expect(areLabelsEqual(component1, component2)).toBe(true);

  // Same component; same props, different children
  component2 = <Text>Another Comment</Text>;
  expect(areLabelsEqual(component1, component2)).toBe(false);

  // Different component; same props, same children
  component2 = <View>Comments</View>;
  expect(areLabelsEqual(component1, component2)).toBe(false);

  // Same component; different props, same children
  component2 = (
    <Text multiline style={{ color: red500 }}>
      Comments
    </Text>
  );
  expect(areLabelsEqual(component1, component2)).toBe(false);
});

it('correctly compares labels for nested components', () => {
  // Same component; same props, same children
  const component1 = (
    <Text>
      <Text style={{ color: red500 }}>*</Text> Comments
    </Text>
  );

  let component2 = (
    <Text>
      <Text style={{ color: red500 }}>*</Text> Comments
    </Text>
  );
  expect(areLabelsEqual(component1, component2)).toBe(true);

  // Same component; same props, different children
  component2 = (
    <Text>
      <Text style={{ color: red500 }}>Comments</Text> continues
    </Text>
  );
  expect(areLabelsEqual(component1, component2)).toBe(false);

  // Different component; same props, same children
  component2 = (
    <View>
      <Text style={{ color: red500 }}>*</Text> Comments
    </View>
  );
  expect(areLabelsEqual(component1, component2)).toBe(false);

  // Same component; different props, same children
  component2 = (
    <Text multiline>
      <Text style={{ color: red500 }}>*</Text> Comments
    </Text>
  );
  expect(areLabelsEqual(component1, component2)).toBe(false);

  // Same component; same props, different number of children
  component2 = (
    <Text>
      <Text style={{ color: red500 }}>*</Text>
    </Text>
  );
  expect(areLabelsEqual(component1, component2)).toBe(false);

  // Same component; different props in inner component, same children
  component2 = (
    <Text>
      <Text multiline style={{ color: blue500 }}>
        *
      </Text>{' '}
      Comments
    </Text>
  );
  expect(areLabelsEqual(component1, component2)).toBe(false);
});
