import * as React from 'react';
import { I18nManager, StyleSheet, TextInput, View } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';

import TextField, {
  type TextFieldAccessoryProps,
} from '../TextField/TextField';

const defaultI18nIsRTL = I18nManager.isRTL;

afterEach(() => {
  I18nManager.isRTL = defaultI18nIsRTL;
});

function firstIndexOfTestIdInTree(tree: unknown, testID: string): number {
  const serialized = JSON.stringify(tree);
  const match = new RegExp(`"testID":\\s*"${testID}"`).exec(serialized);
  return match ? match.index : -1;
}

it('renders filled TextField with label and value', () => {
  const tree = render(
    <TextField label="Email" value="a@b.co" onChangeText={() => {}} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextField with label and value', () => {
  const tree = render(
    <TextField
      variant="outlined"
      label="Password"
      value="secret"
      onChangeText={() => {}}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders supporting text below the field', () => {
  const { getByText } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Use a valid address"
    />
  );

  expect(getByText('Use a valid address')).toBeTruthy();
});

it('sets aria-invalid on the input when status is error', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="bad"
      onChangeText={() => {}}
      status="error"
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-invalid']).toBe(true);
});

it('uses assertive aria-live on supporting text when status is error', () => {
  const { getByText } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Invalid"
      status="error"
    />
  );

  expect(getByText('Invalid').props['aria-live']).toBe('assertive');
});

it('uses polite aria-live on supporting text when there is no error', () => {
  const { getByText } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Optional"
    />
  );

  expect(getByText('Optional').props['aria-live']).toBe('polite');
});

it('marks the input as aria-disabled when editable is false', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-disabled']).toBe(true);
});

it('marks the input as aria-disabled when status is disabled', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      status="disabled"
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-disabled']).toBe(true);
});

it('forwards TextInput props such as testID', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="email-input"
    />
  );

  expect(getByTestId('email-input')).toBeTruthy();
});

it('does not pass TextField-only props through to TextInput', () => {
  const { getByTestId } = render(
    <TextField
      variant="outlined"
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="tf-native"
    />
  );

  const input = getByTestId('tf-native');
  expect(input.props.variant).toBeUndefined();
  expect(input.props.theme).toBeUndefined();
  expect(input.props.StartAccessory).toBeUndefined();
  expect(input.props.EndAccessory).toBeUndefined();
  expect(input.props.pressableStyle).toBeUndefined();
  expect(input.props.fieldStyle).toBeUndefined();
  expect(input.props.containerStyle).toBeUndefined();
  expect(input.props.supportingText).toBeUndefined();
  expect(input.props.supportingTextProps).toBeUndefined();
});

it('invokes onFocus and onBlur on the TextInput', () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      onFocus={onFocus}
      onBlur={onBlur}
      testID="tf-input"
    />
  );

  const input = getByTestId('tf-input');
  fireEvent(input, 'focus');
  fireEvent(input, 'blur');

  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(onBlur).toHaveBeenCalledTimes(1);
});

it('focuses the TextInput when the outer Pressable is pressed', () => {
  const focusSpy = jest.spyOn(TextInput.prototype, 'focus');

  const { UNSAFE_getByProps, getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input')).toBeTruthy();

  /* Pressable is not exposed as a distinct type in the test renderer; match its props. */
  const pressable = UNSAFE_getByProps({ role: 'none', accessible: false });
  fireEvent.press(pressable);

  expect(focusSpy).toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('does not focus the TextInput when disabled and the Pressable is pressed', () => {
  const focusSpy = jest.spyOn(TextInput.prototype, 'focus');

  const { UNSAFE_getByProps } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      editable={false}
    />
  );

  const pressable = UNSAFE_getByProps({ role: 'none', accessible: false });
  fireEvent.press(pressable);

  expect(focusSpy).not.toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('exposes the TextInput instance via ref prop', () => {
  const ref = React.createRef<TextInput>();

  render(
    <TextField
      ref={ref}
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="tf-input"
    />
  );

  expect(ref.current).toBeTruthy();
  expect(typeof ref.current?.focus).toBe('function');
});

it('passes status, editable, and multiline to accessories', () => {
  const startAccessoryProps: TextFieldAccessoryProps[] = [];
  const endAccessoryProps: TextFieldAccessoryProps[] = [];

  function StartAccessory(props: TextFieldAccessoryProps) {
    startAccessoryProps.push(props);
    return <View testID="start-accessory" />;
  }

  function EndAccessory(props: TextFieldAccessoryProps) {
    endAccessoryProps.push(props);
    return <View testID="end-accessory" />;
  }

  const { getByTestId } = render(
    <TextField
      label="Search"
      value=""
      onChangeText={() => {}}
      multiline
      status="error"
      editable={false}
      StartAccessory={StartAccessory}
      EndAccessory={EndAccessory}
    />
  );

  expect(getByTestId('start-accessory')).toBeTruthy();
  expect(getByTestId('end-accessory')).toBeTruthy();
  expect(startAccessoryProps[0]).toMatchObject({
    status: 'error',
    editable: false,
    multiline: true,
  });
  expect(endAccessoryProps[0]).toMatchObject({
    status: 'error',
    editable: false,
    multiline: true,
  });
});

it('applies supportingTextProps to the supporting Text', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Hint"
      supportingTextProps={{ testID: 'supporting-text' }}
    />
  );

  expect(getByTestId('supporting-text').props.children).toBe('Hint');
});

it('applies RTL text alignment and writing direction to the TextInput (filled)', () => {
  I18nManager.isRTL = true;

  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      testID="tf-input-rtl"
    />
  );

  expect(StyleSheet.flatten(getByTestId('tf-input-rtl').props.style)).toEqual(
    expect.objectContaining({
      textAlign: 'right',
      writingDirection: 'rtl',
    })
  );
});

it('applies RTL text alignment and writing direction to the TextInput (outlined)', () => {
  I18nManager.isRTL = true;

  const { getByTestId } = render(
    <TextField
      variant="outlined"
      label="Email"
      value="x"
      onChangeText={() => {}}
      testID="tf-input-rtl-outlined"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-input-rtl-outlined').props.style)
  ).toEqual(
    expect.objectContaining({
      textAlign: 'right',
      writingDirection: 'rtl',
    })
  );
});

it('applies RTL writing direction to supporting text', () => {
  I18nManager.isRTL = true;

  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Hint"
      supportingTextProps={{ testID: 'supporting-text-rtl' }}
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('supporting-text-rtl').props.style)
  ).toEqual(
    expect.objectContaining({
      writingDirection: 'rtl',
    })
  );
});

it('places EndAccessory before StartAccessory in the tree when RTL', () => {
  I18nManager.isRTL = true;

  function StartAccessory() {
    return <View testID="rtl-acc-from-start-prop" />;
  }

  function EndAccessory() {
    return <View testID="rtl-acc-from-end-prop" />;
  }

  const { toJSON } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      StartAccessory={StartAccessory}
      EndAccessory={EndAccessory}
      testID="tf-input-rtl-order"
    />
  );

  const tree = toJSON();
  expect(firstIndexOfTestIdInTree(tree, 'rtl-acc-from-end-prop')).toBeLessThan(
    firstIndexOfTestIdInTree(tree, 'rtl-acc-from-start-prop')
  );
});

it('places StartAccessory before EndAccessory in the tree when LTR', () => {
  I18nManager.isRTL = false;

  function StartAccessory() {
    return <View testID="ltr-acc-from-start-prop" />;
  }

  function EndAccessory() {
    return <View testID="ltr-acc-from-end-prop" />;
  }

  const { toJSON } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      StartAccessory={StartAccessory}
      EndAccessory={EndAccessory}
      testID="tf-input-ltr-order"
    />
  );

  const tree = toJSON();
  expect(
    firstIndexOfTestIdInTree(tree, 'ltr-acc-from-start-prop')
  ).toBeLessThan(firstIndexOfTestIdInTree(tree, 'ltr-acc-from-end-prop'));
});

it('hides placeholder when the TextField is not focused', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props.placeholder).toBeUndefined();
});

it('shows placeholder when the TextField is focused', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  fireEvent(getByTestId('tf-input'), 'focus');

  expect(getByTestId('tf-input').props.placeholder).toBe(
    'e.g. user@example.com'
  );
});

it('shows placeholder on multiline TextField when focused', () => {
  const { getByTestId } = render(
    <TextField
      label="Notes"
      value=""
      onChangeText={() => {}}
      placeholder="Add a note…"
      multiline
      testID="tf-multiline"
    />
  );

  expect(getByTestId('tf-multiline').props.placeholder).toBeUndefined();

  fireEvent(getByTestId('tf-multiline'), 'focus');

  expect(getByTestId('tf-multiline').props.placeholder).toBe('Add a note…');
});

it('hides placeholder again after the TextField loses focus', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  fireEvent(getByTestId('tf-input'), 'focus');
  fireEvent(getByTestId('tf-input'), 'blur');

  expect(getByTestId('tf-input').props.placeholder).toBeUndefined();
});

it('maps a lone StartAccessory to leading in LTR and trailing in RTL (tree order)', () => {
  function LoneStartAccessory() {
    return <View testID="lone-start-acc" />;
  }

  I18nManager.isRTL = false;

  const { toJSON: toJsonLtr } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      StartAccessory={LoneStartAccessory}
      testID="tf-lone-ltr"
    />
  );

  I18nManager.isRTL = true;

  const { toJSON: toJsonRtl } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      StartAccessory={LoneStartAccessory}
      testID="tf-lone-rtl"
    />
  );

  const ltrTree = toJsonLtr();
  expect(firstIndexOfTestIdInTree(ltrTree, 'lone-start-acc')).toBeLessThan(
    firstIndexOfTestIdInTree(ltrTree, 'tf-lone-ltr')
  );

  const rtlTree = toJsonRtl();
  expect(firstIndexOfTestIdInTree(rtlTree, 'tf-lone-rtl')).toBeLessThan(
    firstIndexOfTestIdInTree(rtlTree, 'lone-start-acc')
  );
});
