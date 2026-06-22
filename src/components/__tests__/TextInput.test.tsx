import * as React from 'react';
import { I18nManager, TextInput as NativeTextInput, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import {
  afterAll,
  afterEach,
  beforeAll,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { TestInstance } from 'test-renderer';

import { act, fireEvent, render, screen, userEvent } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import TextInput from '../TextInput';
import type {
  TextInputRenderProps,
  TextInputHandles,
} from '../TextInput/TextInput';
import type { TextInputAccessoryProps } from '../TextInput/TextInputIcon';

const stateOpacity = tokens.md.sys.state.opacity;

const defaultI18nIsRTL = I18nManager.isRTL;
const includeHiddenElements = { includeHiddenElements: true };

const getOuterTextInputPressable = (root: TestInstance | null) => {
  const [pressable] =
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace non-accessible outer Pressable lookup with a public behavior assertion.
    root?.queryAll(
      (instance) =>
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        instance.props.role === 'none' && instance.props.accessible === false,
      { includeSelf: true }
    ) ?? [];

  if (!pressable) {
    throw new Error('Expected outer TextInput Pressable');
  }

  return pressable;
};

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

it('renders filled TextInput with label and value', async () => {
  const tree = (
    await render(
      <TextInput label="Email" value="a@b.co" onChangeText={() => {}} />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextInput with label and value', async () => {
  const tree = (
    await render(
      <TextInput
        variant="outlined"
        label="Password"
        value="secret"
        onChangeText={() => {}}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled TextInput with TextInput.Icon accessories', async () => {
  const tree = (
    await render(
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
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextInput with TextInput.Icon accessories', async () => {
  const tree = (
    await render(
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
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled TextInput with TextInput.Icon accessories when error is true', async () => {
  const tree = (
    await render(
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
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined TextInput with TextInput.Icon accessories when error is true', async () => {
  const tree = (
    await render(
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
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('fires onPress on TextInput.Icon end accessory', async () => {
  const onClear = jest.fn<(event: GestureResponderEvent) => void>();
  await render(
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

  await userEvent.press(screen.getAllByTestId('icon-button')[1]);

  expect(onClear).toHaveBeenCalledTimes(1);
});

it('disables TextInput.Icon when the field is disabled', async () => {
  await render(
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

  const buttons = screen.getAllByTestId('icon-button');
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(buttons[0].props.accessibilityState?.disabled).toBe(true);
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(buttons[1].props.accessibilityState?.disabled).toBe(true);
});

it('does not disable TextInput.Icon when the field is read-only (editable false)', async () => {
  await render(
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

  const buttons = screen.getAllByTestId('icon-button');
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(buttons[0].props.accessibilityState?.disabled).not.toBe(true);
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(buttons[1].props.accessibilityState?.disabled).not.toBe(true);
});

it('renders supporting text below the field', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Use a valid address"
    />
  );

  expect(
    screen.getByText('Use a valid address', includeHiddenElements)
  ).toBeOnTheScreen();
});

it('uses polite aria-live on error supporting text', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Invalid"
      error
      testID="tf-input"
    />
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByText('Invalid').props['aria-live']).toBe('polite');
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props.accessibilityState?.invalid).toBe(
    true
  );
});

it('marks the input invalid when error is true without supporting text', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      error
      testID="tf-input"
    />
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props.accessibilityState?.invalid).toBe(
    true
  );
  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('tf-input').props.accessibilityHint
  ).toBeUndefined();
});

it('hides helper supporting text from the accessibility tree and omits aria-live', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Optional"
      testID="tf-input"
    />
  );

  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByText('Optional', includeHiddenElements).props['aria-hidden']
  ).toBe(true);
  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByText('Optional', includeHiddenElements).props['aria-live']
  ).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props['aria-label']).toBe(
    'Email, Optional'
  );
});

it('includes supporting text in aria-label when label is omitted', async () => {
  await render(
    <TextInput
      value=""
      onChangeText={() => {}}
      supportingText="Helper only"
      testID="tf-input"
    />
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props['aria-label']).toBe(
    'Helper only'
  );
});

it('does not mark the input as aria-disabled when editable is false (read-only)', async () => {
  await render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input"
    />
  );

  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('tf-input').props.accessibilityState?.disabled
  ).not.toBe(true);
});

it('marks the input as disabled in accessibilityState when disabled is true', async () => {
  await render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input"
    />
  );

  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('tf-input').props.accessibilityState?.disabled
  ).toBe(true);
});

it('renders the input via render with merged props', async () => {
  const renderInput = jest.fn((props: TextInputRenderProps) => (
    <NativeTextInput {...props} testID="custom-input" />
  ));

  await render(
    <TextInput
      label="Pin"
      value="12"
      onChangeText={() => {}}
      render={renderInput}
    />
  );

  expect(screen.getByTestId('custom-input')).toBeOnTheScreen();
  expect(renderInput).toHaveBeenCalled();
  const merged = renderInput.mock.calls[0]?.[0] as TextInputRenderProps;
  expect(merged['aria-label']).toBe('Pin');
  expect(merged.value).toBe('12');
});

it('does not apply disabled opacity to the TextInput when editable is false (filled)', async () => {
  await render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input-ro"
    />
  );

  expect(screen.getByTestId('tf-input-ro')).not.toHaveStyle({
    opacity: stateOpacity.disabled,
  });
});

it('does not apply disabled opacity to the TextInput when editable is false (outlined)', async () => {
  await render(
    <TextInput
      variant="outlined"
      label="Email"
      value="x"
      onChangeText={() => {}}
      editable={false}
      testID="tf-input-ro-out"
    />
  );

  expect(screen.getByTestId('tf-input-ro-out')).not.toHaveStyle({
    opacity: stateOpacity.disabled,
  });
});

it('applies disabled opacity to the TextInput when disabled is true (filled)', async () => {
  await render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input-dis"
    />
  );

  expect(screen.getByTestId('tf-input-dis')).toHaveStyle({
    opacity: stateOpacity.disabled,
  });
});

it('applies disabled opacity to the TextInput when disabled is true (outlined)', async () => {
  await render(
    <TextInput
      variant="outlined"
      label="Email"
      value="x"
      onChangeText={() => {}}
      disabled
      testID="tf-input-dis-out"
    />
  );

  expect(screen.getByTestId('tf-input-dis-out')).toHaveStyle({
    opacity: stateOpacity.disabled,
  });
});

it('forwards TextInput props such as testID', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="email-input"
    />
  );

  expect(screen.getByTestId('email-input')).toBeOnTheScreen();
});

/* TextInput peels these before spreading onto TextInput (see TextInput.tsx).
 * Custom layout / sub-component styling props are intentionally not supported. */
it('does not pass TextInput-only props through to TextInput', async () => {
  await render(
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

  const input = screen.getByTestId('tf-native');
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.variant).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.theme).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.startAccessory).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.endAccessory).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.label).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.supportingText).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.prefix).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.suffix).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.counter).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.error).toBeUndefined();
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.disabled).toBeUndefined();
});

it('shows a character counter when counter is true and maxLength is set (filled)', async () => {
  await render(
    <TextInput
      label="Bio"
      value="hello"
      onChangeText={() => {}}
      counter
      maxLength={100}
    />
  );

  expect(screen.getByText('5/100')).toBeOnTheScreen();
  expect(screen.queryByText('0/100')).not.toBeOnTheScreen();
});

it('shows a character counter when counter is true and maxLength is set (outlined)', async () => {
  await render(
    <TextInput
      variant="outlined"
      label="Bio"
      value=""
      onChangeText={() => {}}
      counter
      maxLength={50}
    />
  );

  expect(screen.getByText('0/50')).toBeOnTheScreen();
});

it('updates the character counter when the value changes', async () => {
  const { rerender } = await render(
    <TextInput
      label="Bio"
      value="a"
      onChangeText={() => {}}
      counter
      maxLength={10}
    />
  );

  expect(screen.getByText('1/10')).toBeOnTheScreen();

  await rerender(
    <TextInput
      label="Bio"
      value="abcd"
      onChangeText={() => {}}
      counter
      maxLength={10}
    />
  );

  expect(screen.getByText('4/10')).toBeOnTheScreen();
});

it('does not show a character counter when counter is false', async () => {
  await render(
    <TextInput
      label="Bio"
      value="hello"
      onChangeText={() => {}}
      maxLength={100}
    />
  );

  expect(screen.queryByText('5/100')).not.toBeOnTheScreen();
});

it('does not show a character counter when maxLength is missing', async () => {
  await render(
    <TextInput label="Bio" value="hello" onChangeText={() => {}} counter />
  );

  expect(screen.queryByText('5/100')).not.toBeOnTheScreen();
  expect(screen.queryByText(/\//)).not.toBeOnTheScreen();
});

it('invokes onFocus and onBlur on the TextInput', async () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      onFocus={onFocus}
      onBlur={onBlur}
      testID="tf-input"
    />
  );

  const input = screen.getByTestId('tf-input');
  await fireEvent(input, 'focus');
  await fireEvent(input, 'blur');

  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(onBlur).toHaveBeenCalledTimes(1);
});

it('focuses the TextInput when the outer Pressable is pressed', async () => {
  const focusSpy = jest.spyOn(NativeTextInput.prototype, 'focus');

  const { root } = await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      testID="tf-input"
    />
  );

  expect(screen.getByTestId('tf-input')).toBeOnTheScreen();

  await userEvent.press(getOuterTextInputPressable(root));

  expect(focusSpy).toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('does not focus the TextInput when disabled and the Pressable is pressed', async () => {
  const focusSpy = jest.spyOn(NativeTextInput.prototype, 'focus');

  const { root } = await render(
    <TextInput label="Email" value="" onChangeText={() => {}} disabled />
  );

  await userEvent.press(getOuterTextInputPressable(root));

  expect(focusSpy).not.toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('focuses the TextInput when read-only and the Pressable is pressed', async () => {
  const focusSpy = jest.spyOn(NativeTextInput.prototype, 'focus');

  const { root } = await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      editable={false}
    />
  );

  await userEvent.press(getOuterTextInputPressable(root));

  expect(focusSpy).toHaveBeenCalled();
  focusSpy.mockRestore();
});

it('exposes the TextInput instance via ref prop', async () => {
  const ref = React.createRef<TextInputHandles>();

  await render(
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

it('passes error, disabled, and multiline to accessories', async () => {
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

  await render(
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

  expect(screen.getByTestId('start-accessory')).toBeOnTheScreen();
  expect(screen.getByTestId('end-accessory')).toBeOnTheScreen();
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

it('passes error to accessories when the field is disabled', async () => {
  const startAccessoryProps: TextInputAccessoryProps[] = [];

  function StartAccessory(props: TextInputAccessoryProps) {
    startAccessoryProps.push(props);
    return <View testID="start-acc-error-disabled" />;
  }

  await render(
    <TextInput
      label="Search"
      value=""
      onChangeText={() => {}}
      error
      disabled
      startAccessory={StartAccessory}
    />
  );

  expect(screen.getByTestId('start-acc-error-disabled')).toBeOnTheScreen();
  expect(startAccessoryProps[0].error).toBe(true);
  expect(startAccessoryProps[0].disabled).toBe(true);
});

it('renders supporting text as a Text child', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Hint"
    />
  );

  expect(screen.getByText('Hint', includeHiddenElements)).toBeOnTheScreen();
});

it('renders the counter as a Text child', async () => {
  await render(
    <TextInput
      label="Bio"
      value="hi"
      onChangeText={() => {}}
      counter
      maxLength={80}
    />
  );

  expect(screen.getByText('2/80')).toBeOnTheScreen();
});

it('renders supporting text and counter separately when both are shown', async () => {
  await render(
    <TextInput
      label="Bio"
      value="x"
      onChangeText={() => {}}
      supportingText="Help text"
      counter
      maxLength={10}
    />
  );

  expect(
    screen.getByText('Help text', includeHiddenElements)
  ).toBeOnTheScreen();
  expect(screen.getByText('1/10')).toBeOnTheScreen();
});

it('applies RTL text alignment and writing direction to the TextInput (filled)', async () => {
  I18nManager.isRTL = true;

  await render(
    <TextInput
      label="Email"
      value="x"
      onChangeText={() => {}}
      testID="tf-input-rtl"
    />
  );

  expect(screen.getByTestId('tf-input-rtl')).toHaveStyle({
    textAlign: 'right',
    writingDirection: 'rtl',
  });
});

it('applies RTL text alignment and writing direction to the TextInput (outlined)', async () => {
  I18nManager.isRTL = true;

  await render(
    <TextInput
      variant="outlined"
      label="Email"
      value="x"
      onChangeText={() => {}}
      testID="tf-input-rtl-outlined"
    />
  );

  expect(screen.getByTestId('tf-input-rtl-outlined')).toHaveStyle({
    textAlign: 'right',
    writingDirection: 'rtl',
  });
});

it('applies RTL writing direction to supporting text', async () => {
  I18nManager.isRTL = true;

  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      supportingText="Hint"
    />
  );

  expect(screen.getByText('Hint', includeHiddenElements)).toHaveStyle({
    writingDirection: 'rtl',
  });
});

it('places EndAccessory before StartAccessory in the tree when RTL', async () => {
  I18nManager.isRTL = true;

  function StartAccessory() {
    return <View testID="rtl-acc-from-start-prop" />;
  }

  function EndAccessory() {
    return <View testID="rtl-acc-from-end-prop" />;
  }

  const { toJSON } = await render(
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

it('places StartAccessory before EndAccessory in the tree when LTR', async () => {
  I18nManager.isRTL = false;

  function StartAccessory() {
    return <View testID="ltr-acc-from-start-prop" />;
  }

  function EndAccessory() {
    return <View testID="ltr-acc-from-end-prop" />;
  }

  const { toJSON } = await render(
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

it('does not expose the placeholder string when the TextInput is not focused', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  /* Sentinel space avoids iOS multiline UITextView not updating placeholder from nil (react-native#31573). */
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props.placeholder).toBe(' ');
});

it('shows placeholder when unfocused and no label is given', async () => {
  await render(
    <TextInput
      value=""
      onChangeText={() => {}}
      placeholder="Search"
      testID="tf-input-no-label"
    />
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input-no-label').props.placeholder).toBe(
    'Search'
  );
});

it('shows placeholder when the TextInput is focused', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  await fireEvent(screen.getByTestId('tf-input'), 'focus');

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props.placeholder).toBe(
    'e.g. user@example.com'
  );
});

it('shows placeholder on multiline TextInput when focused', async () => {
  await render(
    <TextInput
      label="Notes"
      value=""
      onChangeText={() => {}}
      placeholder="Add a note…"
      multiline
      testID="tf-multiline"
    />
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-multiline').props.placeholder).toBe(' ');

  await fireEvent(screen.getByTestId('tf-multiline'), 'focus');

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-multiline').props.placeholder).toBe(
    'Add a note…'
  );
});

it('does not expose the placeholder string again after the TextInput loses focus', async () => {
  await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      placeholder="e.g. user@example.com"
      testID="tf-input"
    />
  );

  await fireEvent(screen.getByTestId('tf-input'), 'focus');
  await fireEvent(screen.getByTestId('tf-input'), 'blur');

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(screen.getByTestId('tf-input').props.placeholder).toBe(' ');
});

it('maps a lone StartAccessory to leading in LTR and trailing in RTL (tree order)', async () => {
  function LoneStartAccessory() {
    return <View testID="lone-start-acc" />;
  }

  I18nManager.isRTL = false;

  const { toJSON: toJsonLtr } = await render(
    <TextInput
      label="Email"
      value=""
      onChangeText={() => {}}
      startAccessory={LoneStartAccessory}
      testID="tf-lone-ltr"
    />
  );

  I18nManager.isRTL = true;

  const { toJSON: toJsonRtl } = await render(
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

it('shows prefix and suffix when the field is floating and hides them after value is cleared while blurred', async () => {
  const { rerender } = await render(
    <TextInput
      label="Amount"
      value="1"
      onChangeText={() => {}}
      prefix="$"
      suffix="/100"
      testID="tf-ps"
    />
  );

  expect(screen.getByText('$')).toBeOnTheScreen();
  expect(screen.getByText('/100')).toBeOnTheScreen();

  await rerender(
    <TextInput
      label="Amount"
      value=""
      onChangeText={() => {}}
      prefix="$"
      suffix="/100"
      testID="tf-ps"
    />
  );

  expect(screen.queryByText('$')).not.toBeOnTheScreen();
  expect(screen.queryByText('/100')).not.toBeOnTheScreen();
  expect(screen.getByTestId('tf-ps')).toBeOnTheScreen();
});

it('renders prefix and suffix while focused even when value is empty', async () => {
  await render(
    <TextInput
      label="Amount"
      value=""
      onChangeText={() => {}}
      prefix="$"
      suffix=" kg"
      testID="tf-ps-focus"
    />
  );

  expect(screen.queryByText('$')).not.toBeOnTheScreen();
  expect(screen.queryByText(' kg')).not.toBeOnTheScreen();

  await fireEvent(screen.getByTestId('tf-ps-focus'), 'focus');

  expect(screen.getByText('$')).toBeOnTheScreen();
  expect(screen.getByText(' kg')).toBeOnTheScreen();
});

it('places prefix Text before the TextInput and suffix Text after it', async () => {
  const { toJSON } = await render(
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

it('aligns input text toward the suffix when suffix is active (LTR)', async () => {
  await render(
    <TextInput
      label="Label"
      value="5"
      onChangeText={() => {}}
      suffix="/100"
      testID="tf-suffix-align-ltr"
    />
  );

  expect(screen.getByTestId('tf-suffix-align-ltr')).toHaveStyle({
    textAlign: 'right',
    writingDirection: 'ltr',
  });
});

it('aligns input text toward the suffix when suffix is active (RTL)', async () => {
  I18nManager.isRTL = true;

  await render(
    <TextInput
      label="Label"
      value="5"
      onChangeText={() => {}}
      suffix="/100"
      testID="tf-suffix-align-rtl"
    />
  );

  expect(screen.getByTestId('tf-suffix-align-rtl')).toHaveStyle({
    textAlign: 'left',
    writingDirection: 'rtl',
  });
});

it('uses default horizontal alignment when suffix prop exists but suffix is not shown yet (LTR)', async () => {
  await render(
    <TextInput
      label="Label"
      value=""
      onChangeText={() => {}}
      suffix="/100"
      testID="tf-no-suffix-yet"
    />
  );

  expect(screen.getByTestId('tf-no-suffix-yet')).toHaveStyle({
    textAlign: 'left',
    writingDirection: 'ltr',
  });
});

it('does not apply the TextInput style prop to prefix or suffix Text', async () => {
  await render(
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

  expect(screen.getByTestId('tf-input-style')).toHaveStyle({
    fontSize: 40,
    letterSpacing: 9,
  });

  expect(screen.getByText('$')).not.toHaveStyle({ fontSize: 40 });
  expect(screen.getByText('$')).not.toHaveStyle({ letterSpacing: 9 });
  expect(screen.getByText(']')).not.toHaveStyle({ fontSize: 40 });
  expect(screen.getByText(']')).not.toHaveStyle({ letterSpacing: 9 });
});

it('passes defaultValue to the native input when uncontrolled without counter', async () => {
  await render(
    <TextInput
      label="Email"
      defaultValue="hello"
      onChangeText={() => {}}
      testID="tf-uncontrolled"
    />
  );

  const input = screen.getByTestId('tf-uncontrolled');
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.defaultValue).toBe('hello');
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.value).toBeUndefined();
});

it('updates the character counter for an uncontrolled field with counter enabled', async () => {
  const onChangeText = jest.fn();
  await render(
    <TextInput
      label="Bio"
      defaultValue="a"
      onChangeText={onChangeText}
      counter
      maxLength={10}
      testID="tf-uncontrolled-counter"
    />
  );

  expect(screen.getByText('1/10')).toBeOnTheScreen();

  await userEvent.type(screen.getByTestId('tf-uncontrolled-counter'), 'bcd');

  expect(onChangeText).toHaveBeenCalledWith('abcd');
  expect(screen.getByText('4/10')).toBeOnTheScreen();
});

it('resets counter and hides prefix/suffix when clear() is called on uncontrolled field while blurred', async () => {
  const ref = React.createRef<TextInputHandles>();
  await render(
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

  expect(screen.getByText('3/200')).toBeOnTheScreen();
  expect(screen.getByText('$')).toBeOnTheScreen();
  expect(screen.getByText('/100')).toBeOnTheScreen();

  await act(() => {
    ref.current?.clear();
  });

  expect(screen.getByText('0/200', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.queryByText('$')).not.toBeOnTheScreen();
  expect(screen.queryByText('/100')).not.toBeOnTheScreen();
});

it('resets counter but keeps prefix/suffix visible when clear() is called on uncontrolled field while focused', async () => {
  const ref = React.createRef<TextInputHandles>();
  await render(
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

  expect(screen.getByText('2/100', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.getByText('$', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.getByText(' kg', includeHiddenElements)).toBeOnTheScreen();

  await fireEvent(screen.getByTestId('tf-clear-focused'), 'focus');

  await act(() => {
    ref.current?.clear();
  });

  expect(screen.getByText('0/100', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.getByText('$', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.getByText(' kg', includeHiddenElements)).toBeOnTheScreen();
});

it('notifies the parent via onChangeText when clear() is called on a controlled field', async () => {
  const ref = React.createRef<TextInputHandles>();
  const onChangeText = jest.fn();
  await render(
    <TextInput
      ref={ref}
      label="Email"
      value="test@example.com"
      onChangeText={onChangeText}
      testID="tf-controlled"
    />
  );

  const input = screen.getByTestId('tf-controlled', includeHiddenElements);
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(input.props.value).toBe('test@example.com');

  await act(() => {
    ref.current?.clear();
  });

  expect(onChangeText).toHaveBeenCalledWith('');
  expect(onChangeText).toHaveBeenCalledTimes(1);
});

it('hides prefix/suffix when blurring after clear() was called while focused', async () => {
  const ref = React.createRef<TextInputHandles>();
  await render(
    <TextInput
      ref={ref}
      label="Amount"
      defaultValue="100"
      prefix="$"
      suffix="/100"
      testID="tf-clear-then-blur"
    />
  );

  expect(screen.getByText('$', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.getByText('/100', includeHiddenElements)).toBeOnTheScreen();

  await fireEvent(screen.getByTestId('tf-clear-then-blur'), 'focus');

  await act(() => {
    ref.current?.clear();
  });

  // While focused, prefix/suffix stay visible
  expect(screen.getByText('$', includeHiddenElements)).toBeOnTheScreen();
  expect(screen.getByText('/100', includeHiddenElements)).toBeOnTheScreen();

  await fireEvent(screen.getByTestId('tf-clear-then-blur'), 'blur');

  // After blur with no text, prefix/suffix should be hidden
  expect(screen.queryByText('$')).not.toBeOnTheScreen();
  expect(screen.queryByText('/100')).not.toBeOnTheScreen();
});
