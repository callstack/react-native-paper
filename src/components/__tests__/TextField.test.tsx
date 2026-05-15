import * as React from 'react';
import { I18nManager, StyleSheet, TextInput, View } from 'react-native';

import { fireEvent, render } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import TextField from '../TextField';
import type { TextFieldAccessoryProps } from '../TextField/TextField';

const { stateOpacity } = tokens.md.ref;

const defaultI18nIsRTL = I18nManager.isRTL;

const getConstantsOriginal = I18nManager.getConstants.bind(I18nManager);

beforeAll(() => {
  jest.spyOn(I18nManager, 'getConstants').mockImplementation(() => ({
    ...getConstantsOriginal(),
    isRTL: I18nManager.isRTL,
  }));
});

afterAll(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  I18nManager.isRTL = defaultI18nIsRTL;
});

function firstIndexOfTestIdInTree(tree: unknown, testID: string): number {
  const serialized = JSON.stringify(tree);
  const match = new RegExp(`"testID":\\s*"${testID}"`).exec(serialized);
  return match ? match.index : -1;
}

/** Locates a Text node whose children are serialized as a one-element JSON string array. */
function firstIndexOfTextChildArrayInTree(tree: unknown, text: string): number {
  return JSON.stringify(tree).indexOf(JSON.stringify([text]));
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

it('renders filled TextField with TextField.Icon accessories', () => {
  const tree = render(
    <TextField
      label="Search"
      value="q"
      onChangeText={() => {}}
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" color="#49454F" />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="close" color="#49454F" />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextField with TextField.Icon accessories', () => {
  const tree = render(
    <TextField
      variant="outlined"
      label="Search"
      value="q"
      onChangeText={() => {}}
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" color="#49454F" />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="close" color="#49454F" />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled TextField with TextField.Icon accessories when error is true', () => {
  const tree = render(
    <TextField
      label="Search"
      value="q"
      onChangeText={() => {}}
      error
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextField with TextField.Icon accessories when error is true', () => {
  const tree = render(
    <TextField
      variant="outlined"
      label="Search"
      value="q"
      onChangeText={() => {}}
      error
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('fires onPress on TextField.Icon end accessory', () => {
  const onClear = jest.fn();
  const { getAllByTestId } = render(
    <TextField
      label="Search"
      value="x"
      onChangeText={() => {}}
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon
          {...props}
          icon="close"
          onPress={onClear}
          accessibility={{ accessibilityLabel: 'Clear' }}
        />
      )}
    />
  );

  fireEvent.press(getAllByTestId('icon-button')[1]);

  expect(onClear).toHaveBeenCalledTimes(1);
});

it('disables TextField.Icon when the field is disabled', () => {
  const { getAllByTestId } = render(
    <TextField
      label="Search"
      value="x"
      onChangeText={() => {}}
      disabled
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" onPress={() => {}} />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  );

  const buttons = getAllByTestId('icon-button');
  expect(buttons[0].props.accessibilityState?.disabled).toBe(true);
  expect(buttons[1].props.accessibilityState?.disabled).toBe(true);
});

it('does not disable TextField.Icon when the field is read-only (editable false)', () => {
  const { getAllByTestId } = render(
    <TextField
      label="Search"
      value="x"
      onChangeText={() => {}}
      editable={false}
      startAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="magnify" onPress={() => {}} />
      )}
      endAccessory={(props: TextFieldAccessoryProps) => (
        <TextField.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  );

  const buttons = getAllByTestId('icon-button');
  expect(buttons[0].props.accessibilityState?.disabled).not.toBe(true);
  expect(buttons[1].props.accessibilityState?.disabled).not.toBe(true);
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

it('sets aria-invalid on the input when error is true', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="bad"
      onChangeText={() => {}}
      error
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-invalid']).toBe(true);
});

it('uses assertive aria-live on supporting text when error is true', () => {
  const { getByText } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Invalid"
      error
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

it('does not mark the input as aria-disabled when editable is false (read-only)', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-disabled']).not.toBe(true);
});

it('marks the input as aria-disabled when disabled is true', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-disabled']).toBe(true);
});

it('marks the input as aria-invalid but not aria-disabled when error and read-only', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      error
      editable={false}
      testID="tf-input"
    />
  );

  const input = getByTestId('tf-input');
  expect(input.props['aria-invalid']).toBe(true);
  expect(input.props['aria-disabled']).not.toBe(true);
});

it('marks the input as aria-invalid and aria-disabled when error and disabled', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      error
      disabled
      testID="tf-input"
    />
  );

  const input = getByTestId('tf-input');
  expect(input.props['aria-invalid']).toBe(true);
  expect(input.props['aria-disabled']).toBe(true);
});

it('does not apply disabled opacity to the TextInput when editable is false (filled)', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input-ro"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-input-ro').props.style)
  ).not.toMatchObject({ opacity: stateOpacity.disabled });
});

it('does not apply disabled opacity to the TextInput when editable is false (outlined)', () => {
  const { getByTestId } = render(
    <TextField
      variant="outlined"
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input-ro-out"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-input-ro-out').props.style)
  ).not.toMatchObject({ opacity: stateOpacity.disabled });
});

it('applies disabled opacity to the TextInput when disabled is true (filled)', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input-dis"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-input-dis').props.style)
  ).toMatchObject({ opacity: stateOpacity.disabled });
});

it('applies disabled opacity to the TextInput when disabled is true (outlined)', () => {
  const { getByTestId } = render(
    <TextField
      variant="outlined"
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input-dis-out"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-input-dis-out').props.style)
  ).toMatchObject({ opacity: stateOpacity.disabled });
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

/* TextField peels these before spreading onto TextInput (see TextField.tsx).
 * Custom layout / sub-component styling props are intentionally not supported. */
it('does not pass TextField-only props through to TextInput', () => {
  const { getByTestId } = render(
    <TextField
      variant="outlined"
      label="Email"
      value=""
      onChangeText={() => {}}
      error
      disabled
      testID="tf-native"
    />
  );

  const input = getByTestId('tf-native');
  expect(input.props.variant).toBeUndefined();
  expect(input.props.theme).toBeUndefined();
  expect(input.props.startAccessory).toBeUndefined();
  expect(input.props.endAccessory).toBeUndefined();
  expect(input.props.label).toBeUndefined();
  expect(input.props.supportingText).toBeUndefined();
  expect(input.props.prefix).toBeUndefined();
  expect(input.props.suffix).toBeUndefined();
  expect(input.props.counter).toBeUndefined();
  expect(input.props.error).toBeUndefined();
  expect(input.props.disabled).toBeUndefined();
});

it('shows a character counter when counter is true and maxLength is set (filled)', () => {
  const { getByText, queryByText } = render(
    <TextField
      label="Bio"
      value="hello"
      onChangeText={() => {}}
      counter
      maxLength={100}
    />
  );

  expect(getByText('5/100')).toBeTruthy();
  expect(queryByText('0/100')).toBeNull();
});

it('shows a character counter when counter is true and maxLength is set (outlined)', () => {
  const { getByText } = render(
    <TextField
      variant="outlined"
      label="Bio"
      value=""
      onChangeText={() => {}}
      counter
      maxLength={50}
    />
  );

  expect(getByText('0/50')).toBeTruthy();
});

it('updates the character counter when the value changes', () => {
  const { getByText, rerender } = render(
    <TextField
      label="Bio"
      value="a"
      onChangeText={() => {}}
      counter
      maxLength={10}
    />
  );

  expect(getByText('1/10')).toBeTruthy();

  rerender(
    <TextField
      label="Bio"
      value="abcd"
      onChangeText={() => {}}
      counter
      maxLength={10}
    />
  );

  expect(getByText('4/10')).toBeTruthy();
});

it('does not show a character counter when counter is false', () => {
  const { queryByText } = render(
    <TextField
      label="Bio"
      value="hello"
      onChangeText={() => {}}
      maxLength={100}
    />
  );

  expect(queryByText('5/100')).toBeNull();
});

it('does not show a character counter when maxLength is missing', () => {
  const { queryByText } = render(
    <TextField label="Bio" value="hello" onChangeText={() => {}} counter />
  );

  expect(queryByText('5/100')).toBeNull();
  expect(queryByText(/\//)).toBeNull();
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
    <TextField label="Email" value="" onChangeText={() => {}} disabled />
  );

  const pressable = UNSAFE_getByProps({ role: 'none', accessible: false });
  fireEvent.press(pressable);

  expect(focusSpy).not.toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('focuses the TextInput when read-only and the Pressable is pressed', () => {
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

  expect(focusSpy).toHaveBeenCalled();
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

it('passes error, disabled, and multiline to accessories', () => {
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
      error
      disabled
      startAccessory={StartAccessory}
      endAccessory={EndAccessory}
    />
  );

  expect(getByTestId('start-accessory')).toBeTruthy();
  expect(getByTestId('end-accessory')).toBeTruthy();
  expect(startAccessoryProps[0]).toMatchObject({
    error: true,
    disabled: true,
    multiline: true,
  });
  expect(endAccessoryProps[0]).toMatchObject({
    error: true,
    disabled: true,
    multiline: true,
  });
});

it('passes error to accessories when the field is disabled', () => {
  const startAccessoryProps: TextFieldAccessoryProps[] = [];

  function StartAccessory(props: TextFieldAccessoryProps) {
    startAccessoryProps.push(props);
    return <View testID="start-acc-error-disabled" />;
  }

  const { getByTestId } = render(
    <TextField
      label="Search"
      value=""
      onChangeText={() => {}}
      error
      disabled
      startAccessory={StartAccessory}
    />
  );

  expect(getByTestId('start-acc-error-disabled')).toBeTruthy();
  expect(startAccessoryProps[0].error).toBe(true);
  expect(startAccessoryProps[0].disabled).toBe(true);
});

it('renders supporting text as a Text child', () => {
  const { getByText } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Hint"
    />
  );

  expect(getByText('Hint')).toBeTruthy();
});

it('renders the counter as a Text child', () => {
  const { getByText } = render(
    <TextField
      label="Bio"
      value="hi"
      onChangeText={() => {}}
      counter
      maxLength={80}
    />
  );

  expect(getByText('2/80')).toBeTruthy();
});

it('renders supporting text and counter separately when both are shown', () => {
  const { getByText } = render(
    <TextField
      label="Bio"
      value="x"
      onChangeText={() => {}}
      supportingText="Help text"
      counter
      maxLength={10}
    />
  );

  expect(getByText('Help text')).toBeTruthy();
  expect(getByText('1/10')).toBeTruthy();
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

  const { getByText } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Hint"
    />
  );

  expect(StyleSheet.flatten(getByText('Hint').props.style)).toEqual(
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
      startAccessory={StartAccessory}
      endAccessory={EndAccessory}
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
      startAccessory={StartAccessory}
      endAccessory={EndAccessory}
      testID="tf-input-ltr-order"
    />
  );

  const tree = toJSON();
  expect(
    firstIndexOfTestIdInTree(tree, 'ltr-acc-from-start-prop')
  ).toBeLessThan(firstIndexOfTestIdInTree(tree, 'ltr-acc-from-end-prop'));
});

it('does not expose the placeholder string when the TextField is not focused', () => {
  const { getByTestId } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  /* Sentinel space avoids iOS multiline UITextView not updating placeholder from nil (react-native#31573). */
  expect(getByTestId('tf-input').props.placeholder).toBe(' ');
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

  expect(getByTestId('tf-multiline').props.placeholder).toBe(' ');

  fireEvent(getByTestId('tf-multiline'), 'focus');

  expect(getByTestId('tf-multiline').props.placeholder).toBe('Add a note…');
});

it('does not expose the placeholder string again after the TextField loses focus', () => {
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

  expect(getByTestId('tf-input').props.placeholder).toBe(' ');
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
      startAccessory={LoneStartAccessory}
      testID="tf-lone-ltr"
    />
  );

  I18nManager.isRTL = true;

  const { toJSON: toJsonRtl } = render(
    <TextField
      label="Email"
      value=""
      onChangeText={() => {}}
      startAccessory={LoneStartAccessory}
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

it('shows prefix and suffix when the field is floating and hides them after value is cleared while blurred', () => {
  const { getByTestId, getByText, queryByText, rerender } = render(
    <TextField
      label="Amount"
      value="1"
      onChangeText={() => {}}
      prefix="$"
      suffix="/100"
      testID="tf-ps"
    />
  );

  expect(getByText('$')).toBeTruthy();
  expect(getByText('/100')).toBeTruthy();

  rerender(
    <TextField
      label="Amount"
      value=""
      onChangeText={() => {}}
      prefix="$"
      suffix="/100"
      testID="tf-ps"
    />
  );

  expect(queryByText('$')).toBeNull();
  expect(queryByText('/100')).toBeNull();
  expect(getByTestId('tf-ps')).toBeTruthy();
});

it('renders prefix and suffix while focused even when value is empty', () => {
  const { getByTestId, getByText, queryByText } = render(
    <TextField
      label="Amount"
      value=""
      onChangeText={() => {}}
      prefix="$"
      suffix=" kg"
      testID="tf-ps-focus"
    />
  );

  expect(queryByText('$')).toBeNull();
  expect(queryByText(' kg')).toBeNull();

  fireEvent(getByTestId('tf-ps-focus'), 'focus');

  expect(getByText('$')).toBeTruthy();
  expect(getByText(' kg')).toBeTruthy();
});

it('places prefix Text before the TextInput and suffix Text after it', () => {
  const { toJSON } = render(
    <TextField
      label="Label"
      value="x"
      onChangeText={() => {}}
      prefix="$"
      suffix="/100"
      testID="tf-order"
    />
  );

  const tree = toJSON();
  expect(firstIndexOfTextChildArrayInTree(tree, '$')).toBeLessThan(
    firstIndexOfTestIdInTree(tree, 'tf-order')
  );
  expect(firstIndexOfTestIdInTree(tree, 'tf-order')).toBeLessThan(
    firstIndexOfTextChildArrayInTree(tree, '/100')
  );
});

it('aligns input text toward the suffix when suffix is active (LTR)', () => {
  const { getByTestId } = render(
    <TextField
      label="Label"
      value="5"
      onChangeText={() => {}}
      suffix="/100"
      testID="tf-suffix-align-ltr"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-suffix-align-ltr').props.style)
  ).toEqual(
    expect.objectContaining({
      textAlign: 'right',
      writingDirection: 'ltr',
    })
  );
});

it('aligns input text toward the suffix when suffix is active (RTL)', () => {
  I18nManager.isRTL = true;

  const { getByTestId } = render(
    <TextField
      label="Label"
      value="5"
      onChangeText={() => {}}
      suffix="/100"
      testID="tf-suffix-align-rtl"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-suffix-align-rtl').props.style)
  ).toEqual(
    expect.objectContaining({
      textAlign: 'left',
      writingDirection: 'rtl',
    })
  );
});

it('uses default horizontal alignment when suffix prop exists but suffix is not shown yet (LTR)', () => {
  const { getByTestId } = render(
    <TextField
      label="Label"
      value=""
      onChangeText={() => {}}
      suffix="/100"
      testID="tf-no-suffix-yet"
    />
  );

  expect(
    StyleSheet.flatten(getByTestId('tf-no-suffix-yet').props.style)
  ).toEqual(
    expect.objectContaining({
      textAlign: 'left',
      writingDirection: 'ltr',
    })
  );
});

it('does not apply the TextInput style prop to prefix or suffix Text', () => {
  const { getByTestId, getByText } = render(
    <TextField
      label="Label"
      value="1"
      onChangeText={() => {}}
      prefix="$"
      suffix="]"
      style={{ fontSize: 40, letterSpacing: 9 }}
      testID="tf-input-style"
    />
  );

  const inputFlat = StyleSheet.flatten(
    getByTestId('tf-input-style').props.style
  );
  expect(inputFlat).toEqual(
    expect.objectContaining({ fontSize: 40, letterSpacing: 9 })
  );

  const prefixFlat = StyleSheet.flatten(getByText('$').props.style);
  const suffixFlat = StyleSheet.flatten(getByText(']').props.style);

  expect(prefixFlat.fontSize).not.toBe(40);
  expect(prefixFlat.letterSpacing).toBeUndefined();
  expect(suffixFlat.fontSize).not.toBe(40);
  expect(suffixFlat.letterSpacing).toBeUndefined();
});
