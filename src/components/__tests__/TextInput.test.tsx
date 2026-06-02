import * as React from 'react';
import {
  I18nManager,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';

import { act, fireEvent, render } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import TextInput from '../TextInput';
import type {
  TextInputRenderProps,
  TextInputHandles,
} from '../TextInput/TextInput';
import type { TextInputAccessoryProps } from '../TextInput/TextInputIcon';

const stateOpacity = tokens.md.sys.state.opacity;

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

it('renders filled TextInput with label and value', () => {
  const tree = render(
    <TextInput label="Email" value="a@b.co" onChangeText={() => {}} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextInput with label and value', () => {
  const tree = render(
    <TextInput
      variant="outlined"
      label="Password"
      value="secret"
      onChangeText={() => {}}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled TextInput with TextInput.Icon accessories', () => {
  const tree = render(
    <TextInput
      label="Search"
      value="q"
      onChangeText={() => {}}
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" iconColor="#49454F" />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="close" iconColor="#49454F" />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextInput with TextInput.Icon accessories', () => {
  const tree = render(
    <TextInput
      variant="outlined"
      label="Search"
      value="q"
      onChangeText={() => {}}
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" iconColor="#49454F" />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="close" iconColor="#49454F" />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled TextInput with TextInput.Icon accessories when error is true', () => {
  const tree = render(
    <TextInput
      label="Search"
      value="q"
      onChangeText={() => {}}
      error
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextInput with TextInput.Icon accessories when error is true', () => {
  const tree = render(
    <TextInput
      variant="outlined"
      label="Search"
      value="q"
      onChangeText={() => {}}
      error
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('fires onPress on TextInput.Icon end accessory', () => {
  const onClear = jest.fn();
  const { getAllByTestId } = render(
    <TextInput
      label="Search"
      value="x"
      onChangeText={() => {}}
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon
          {...props}
          icon="close"
          onPress={onClear}
          accessibilityLabel="Clear"
        />
      )}
    />
  );

  fireEvent.press(getAllByTestId('icon-button')[1]);

  expect(onClear).toHaveBeenCalledTimes(1);
});

it('disables TextInput.Icon when the field is disabled', () => {
  const { getAllByTestId } = render(
    <TextInput
      label="Search"
      value="x"
      onChangeText={() => {}}
      disabled
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" onPress={() => {}} />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  );

  const buttons = getAllByTestId('icon-button');
  expect(buttons[0].props.accessibilityState?.disabled).toBe(true);
  expect(buttons[1].props.accessibilityState?.disabled).toBe(true);
});

it('does not disable TextInput.Icon when the field is read-only (editable false)', () => {
  const { getAllByTestId } = render(
    <TextInput
      label="Search"
      value="x"
      onChangeText={() => {}}
      editable={false}
      startAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="magnify" onPress={() => {}} />
      )}
      endAccessory={(props: TextInputAccessoryProps) => (
        <TextInput.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  );

  const buttons = getAllByTestId('icon-button');
  expect(buttons[0].props.accessibilityState?.disabled).not.toBe(true);
  expect(buttons[1].props.accessibilityState?.disabled).not.toBe(true);
});

it('renders supporting text below the field', () => {
  const { getByText } = render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Use a valid address"
    />
  );

  expect(getByText('Use a valid address')).toBeTruthy();
});

it('uses polite aria-live on error supporting text', () => {
  const { getByText, getByTestId } = render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Invalid"
      error
      testID="tf-input"
    />
  );

  expect(getByText('Invalid').props['aria-live']).toBe('polite');
  expect(getByTestId('tf-input').props.accessibilityState?.invalid).toBe(true);
});

it('marks the input invalid when error is true without supporting text', () => {
  const { getByTestId } = render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      error
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props.accessibilityState?.invalid).toBe(true);
  expect(getByTestId('tf-input').props.accessibilityHint).toBeUndefined();
});

it('hides helper supporting text from the accessibility tree and omits aria-live', () => {
  const { getByText, getByTestId } = render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Optional"
      testID="tf-input"
    />
  );

  expect(getByText('Optional').props['aria-hidden']).toBe(true);
  expect(getByText('Optional').props['aria-live']).toBeUndefined();
  expect(getByTestId('tf-input').props['aria-label']).toBe('Email, Optional');
});

it('includes supporting text in aria-label when label is omitted', () => {
  const { getByTestId } = render(
    <TextInput
      value=""
      onChangeText={() => {}}
      supportingText="Helper only"
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props['aria-label']).toBe('Helper only');
});

it('does not mark the input as aria-disabled when editable is false (read-only)', () => {
  const { getByTestId } = render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props.accessibilityState?.disabled).not.toBe(
    true
  );
});

it('marks the input as disabled in accessibilityState when disabled is true', () => {
  const { getByTestId } = render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input"
    />
  );

  expect(getByTestId('tf-input').props.accessibilityState?.disabled).toBe(true);
});

it('renders the input via render with merged props', () => {
  const renderInput = jest.fn((props: TextInputRenderProps) => (
    <NativeTextInput {...props} testID="custom-input" />
  ));

  const { getByTestId } = render(
    <TextInput
      label="Pin"
      value="12"
      onChangeText={() => {}}
      render={renderInput}
    />
  );

  expect(getByTestId('custom-input')).toBeTruthy();
  expect(renderInput).toHaveBeenCalled();
  const merged = renderInput.mock.calls[0]?.[0] as TextInputRenderProps;
  expect(merged['aria-label']).toBe('Pin');
  expect(merged.value).toBe('12');
});

it('does not apply disabled opacity to the TextInput when editable is false (filled)', () => {
  const { getByTestId } = render(
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="email-input"
    />
  );

  expect(getByTestId('email-input')).toBeTruthy();
});

/* TextInput peels these before spreading onto TextInput (see TextInput.tsx).
 * Custom layout / sub-component styling props are intentionally not supported. */
it('does not pass TextInput-only props through to TextInput', () => {
  const { getByTestId } = render(
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
      label="Bio"
      value="a"
      onChangeText={() => {}}
      counter
      maxLength={10}
    />
  );

  expect(getByText('1/10')).toBeTruthy();

  rerender(
    <TextInput
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
    <TextInput
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
    <TextInput label="Bio" value="hello" onChangeText={() => {}} counter />
  );

  expect(queryByText('5/100')).toBeNull();
  expect(queryByText(/\//)).toBeNull();
});

it('invokes onFocus and onBlur on the TextInput', () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  const { getByTestId } = render(
    <TextInput
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
  const focusSpy = jest.spyOn(NativeTextInput.prototype, 'focus');

  const { UNSAFE_getByProps, getByTestId } = render(
    <TextInput
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
  const focusSpy = jest.spyOn(NativeTextInput.prototype, 'focus');

  const { UNSAFE_getByProps } = render(
    <TextInput label="Email" value="" onChangeText={() => {}} disabled />
  );

  const pressable = UNSAFE_getByProps({ role: 'none', accessible: false });
  fireEvent.press(pressable);

  expect(focusSpy).not.toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('focuses the TextInput when read-only and the Pressable is pressed', () => {
  const focusSpy = jest.spyOn(NativeTextInput.prototype, 'focus');

  const { UNSAFE_getByProps } = render(
    <TextInput
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
  const ref = React.createRef<TextInputHandles>();

  render(
    <TextInput
      ref={ref}
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="tf-input"
    />
  );

  expect(ref.current).toBeTruthy();
  expect(typeof ref.current?.focus).toBe('function');
  expect(typeof ref.current?.clear).toBe('function');
  expect(typeof ref.current?.blur).toBe('function');
  expect(typeof ref.current?.isFocused).toBe('function');
  expect(typeof ref.current?.setNativeProps).toBe('function');
  expect(typeof ref.current?.setSelection).toBe('function');
});

it('passes error, disabled, and multiline to accessories', () => {
  const startAccessoryProps: TextInputAccessoryProps[] = [];
  const endAccessoryProps: TextInputAccessoryProps[] = [];

  function StartAccessory(props: TextInputAccessoryProps) {
    startAccessoryProps.push(props);
    return <View testID="start-accessory" />;
  }

  function EndAccessory(props: TextInputAccessoryProps) {
    endAccessoryProps.push(props);
    return <View testID="end-accessory" />;
  }

  const { getByTestId } = render(
    <TextInput
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
  const startAccessoryProps: TextInputAccessoryProps[] = [];

  function StartAccessory(props: TextInputAccessoryProps) {
    startAccessoryProps.push(props);
    return <View testID="start-acc-error-disabled" />;
  }

  const { getByTestId } = render(
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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

it('does not expose the placeholder string when the TextInput is not focused', () => {
  const { getByTestId } = render(
    <TextInput
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

it('shows placeholder when unfocused and no label is given', () => {
  const { getByTestId } = render(
    <TextInput
      value=""
      onChangeText={() => {}}
      placeholder="Search"
      testID="tf-input-no-label"
    />
  );

  expect(getByTestId('tf-input-no-label').props.placeholder).toBe('Search');
});

it('shows placeholder when the TextInput is focused', () => {
  const { getByTestId } = render(
    <TextInput
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

it('shows placeholder on multiline TextInput when focused', () => {
  const { getByTestId } = render(
    <TextInput
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

it('does not expose the placeholder string again after the TextInput loses focus', () => {
  const { getByTestId } = render(
    <TextInput
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
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      startAccessory={LoneStartAccessory}
      testID="tf-lone-ltr"
    />
  );

  I18nManager.isRTL = true;

  const { toJSON: toJsonRtl } = render(
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <TextInput
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

it('passes defaultValue to the native input when uncontrolled without counter', () => {
  const { getByTestId } = render(
    <TextInput
      label="Email"
      defaultValue="hello"
      onChangeText={() => {}}
      testID="tf-uncontrolled"
    />
  );

  const input = getByTestId('tf-uncontrolled');
  expect(input.props.defaultValue).toBe('hello');
  expect(input.props.value).toBeUndefined();
});

it('updates the character counter for an uncontrolled field with counter enabled', () => {
  const onChangeText = jest.fn();
  const { getByTestId, getByText } = render(
    <TextInput
      label="Bio"
      defaultValue="a"
      onChangeText={onChangeText}
      counter
      maxLength={10}
      testID="tf-uncontrolled-counter"
    />
  );

  expect(getByText('1/10')).toBeTruthy();

  fireEvent.changeText(getByTestId('tf-uncontrolled-counter'), 'abcd');

  expect(onChangeText).toHaveBeenCalledWith('abcd');
  expect(getByText('4/10')).toBeTruthy();
});

it('resets counter and hides prefix/suffix when clear() is called on uncontrolled field while blurred', () => {
  const ref = React.createRef<TextInputHandles>();
  const { getByText, queryByText } = render(
    <TextInput
      ref={ref}
      label="Amount"
      defaultValue="100"
      prefix="$"
      suffix="/100"
      counter
      maxLength={200}
    />
  );

  expect(getByText('3/200')).toBeTruthy();
  expect(getByText('$')).toBeTruthy();
  expect(getByText('/100')).toBeTruthy();

  act(() => {
    ref.current?.clear();
  });

  expect(getByText('0/200')).toBeTruthy();
  expect(queryByText('$')).toBeNull();
  expect(queryByText('/100')).toBeNull();
});

it('resets counter but keeps prefix/suffix visible when clear() is called on uncontrolled field while focused', () => {
  const ref = React.createRef<TextInputHandles>();
  const { getByTestId, getByText } = render(
    <TextInput
      ref={ref}
      label="Amount"
      defaultValue="50"
      prefix="$"
      suffix=" kg"
      counter
      maxLength={100}
      testID="tf-clear-focused"
    />
  );

  expect(getByText('2/100')).toBeTruthy();
  expect(getByText('$')).toBeTruthy();
  expect(getByText(' kg')).toBeTruthy();

  fireEvent(getByTestId('tf-clear-focused'), 'focus');

  act(() => {
    ref.current?.clear();
  });

  expect(getByText('0/100')).toBeTruthy();
  expect(getByText('$')).toBeTruthy();
  expect(getByText(' kg')).toBeTruthy();
});

it('notifies the parent via onChangeText when clear() is called on a controlled field', () => {
  const ref = React.createRef<TextInputHandles>();
  const onChangeText = jest.fn();
  const { getByTestId } = render(
    <TextInput
      ref={ref}
      label="Email"
      value="test@example.com"
      onChangeText={onChangeText}
      testID="tf-controlled"
    />
  );

  const input = getByTestId('tf-controlled');
  expect(input.props.value).toBe('test@example.com');

  act(() => {
    ref.current?.clear();
  });

  expect(onChangeText).toHaveBeenCalledWith('');
  expect(onChangeText).toHaveBeenCalledTimes(1);
});

it('hides prefix/suffix when blurring after clear() was called while focused', () => {
  const ref = React.createRef<TextInputHandles>();
  const { getByTestId, getByText, queryByText } = render(
    <TextInput
      ref={ref}
      label="Amount"
      defaultValue="100"
      prefix="$"
      suffix="/100"
      testID="tf-clear-then-blur"
    />
  );

  expect(getByText('$')).toBeTruthy();
  expect(getByText('/100')).toBeTruthy();

  fireEvent(getByTestId('tf-clear-then-blur'), 'focus');

  act(() => {
    ref.current?.clear();
  });

  // While focused, prefix/suffix stay visible
  expect(getByText('$')).toBeTruthy();
  expect(getByText('/100')).toBeTruthy();

  fireEvent(getByTestId('tf-clear-then-blur'), 'blur');

  // After blur with no text, prefix/suffix should be hidden
  expect(queryByText('$')).toBeNull();
  expect(queryByText('/100')).toBeNull();
});
