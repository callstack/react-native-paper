import {
  AccessibilityInfo,
  Text,
  Platform,
  TextInput as NativeTextInput,
} from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen, userEvent } from '../../test-utils';
import TextInput from '../TextInput';
import type { TextInputRenderProps } from '../TextInput/TextInput';

const renderInput = jest.fn((props: TextInputRenderProps) => (
  <NativeTextInput {...props} />
));

afterEach(() => {
  jest.restoreAllMocks();
  renderInput.mockClear();
});

it.each(['filled', 'outlined'] as const)(
  'keeps an empty unfocused %s field visible to assistive technology',
  async (variant) => {
    await render(<TextInput variant={variant} label="Email" />);

    expect(screen.getByLabelText('Email')).toBeVisible();
    await fireEvent(screen.getByLabelText('Email'), 'focus');
    await fireEvent(screen.getByLabelText('Email'), 'blur');
    expect(screen.getByLabelText('Email')).toBeVisible();
  }
);

it('preserves accessory refs when switching between decoration and action', async () => {
  const cleanup = jest.fn<() => void>();
  const ref = jest.fn(() => cleanup);
  const props = {
    icon: 'magnify',
    style: {},
    disabled: false,
    error: false,
    multiline: false,
    ref,
  };
  const { rerender, unmount } = await render(<TextInput.Icon {...props} />);
  const decoration = ref.mock.lastCall;
  expect(ref).toHaveBeenCalledWith(
    expect.objectContaining({ measure: expect.any(Function) })
  );

  await rerender(
    <TextInput.Icon {...props} onPress={() => {}} aria-label="Search" />
  );
  expect(cleanup).not.toHaveBeenCalled();
  expect(ref.mock.lastCall).toEqual(decoration);

  await rerender(<TextInput.Icon {...props} />);
  expect(cleanup).not.toHaveBeenCalled();
  await unmount();
  expect(cleanup).toHaveBeenCalledTimes(1);
});

it.each(['filled', 'outlined'] as const)(
  'associates helper and counter without changing the %s field name',
  async (variant) => {
    await render(
      <TextInput
        variant={variant}
        label="Email"
        supportingText="Use a work address"
        counter
        maxLength={40}
        render={renderInput}
      />
    );
    const inputProps = renderInput.mock.lastCall?.[0];
    const ids = inputProps?.['aria-describedby']?.split(' ');

    expect(screen.getByLabelText('Email')).toBeOnTheScreen();
    expect(inputProps?.['aria-describedby']).toEqual(expect.any(String));
    expect(ids).toHaveLength(2);
    expect(screen.getByText('Use a work address')).toHaveProp(
      'nativeID',
      ids?.[0]
    );
    expect(screen.getByText('0/40')).toHaveProp('nativeID', ids?.[1]);
  }
);

it('keeps generated IDs stable as helper text becomes an error and removes absent descriptions', async () => {
  const { rerender } = await render(
    <TextInput label="Email" supportingText="Optional" render={renderInput} />
  );
  const describedBy = renderInput.mock.lastCall?.[0]['aria-describedby'];
  expect(describedBy).toEqual(expect.any(String));

  await rerender(
    <TextInput
      label="Email"
      supportingText="Invalid address"
      error
      render={renderInput}
    />
  );
  expect(screen.getByLabelText('Email')).toHaveProp(
    'aria-describedby',
    describedBy
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid address');
  expect(screen.getByRole('alert')).toHaveProp('nativeID', describedBy);

  await rerender(<TextInput label="Email" render={renderInput} />);
  expect(screen.getByLabelText('Email')).not.toHaveProp('aria-describedby');
  expect(screen.queryByRole('alert')).toBeNull();
});

it('gives different fields distinct description IDs even with the same test ID', async () => {
  await render(
    <>
      <TextInput
        label="First"
        supportingText="First help"
        testID="field"
        render={renderInput}
      />
      <TextInput
        label="Second"
        supportingText="Second help"
        testID="field"
        render={renderInput}
      />
    </>
  );
  const first = renderInput.mock.calls[0]?.[0]['aria-describedby'];
  const second = renderInput.mock.calls[1]?.[0]['aria-describedby'];
  expect(first).toEqual(expect.any(String));
  expect(second).toEqual(expect.any(String));
  expect(first).not.toBe(second);
});

it('merges external descriptions and preserves an explicit accessible name in a custom renderer', async () => {
  await render(
    <TextInput
      label="Email"
      aria-label="Work email"
      aria-describedby="privacy"
      supportingText="Use a work address"
      render={renderInput}
    />
  );
  const describedBy = renderInput.mock.lastCall?.[0]['aria-describedby'];
  expect(describedBy).toMatch(/^privacy \S+$/);
  expect(screen.getByLabelText('Work email')).toHaveProp(
    'aria-describedby',
    describedBy
  );
  expect(screen.getByText('Use a work address')).toHaveProp(
    'nativeID',
    describedBy?.split(' ')[1]
  );
});

it.each(['ios', 'android'] as const)(
  'provides field descriptions as a native hint on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await render(
      <TextInput
        label="Bio"
        accessibilityHint="Double tap to edit"
        supportingText="Keep it short"
        defaultValue="Hi"
        counter
        maxLength={20}
      />
    );
    expect(screen.getByLabelText('Bio')).toHaveProp(
      'accessibilityHint',
      'Double tap to edit, Keep it short, Characters entered 2 of 20'
    );
  }
);

it('uses web descriptions without duplicating them in a hint', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(<TextInput label="Bio" supportingText="Keep it short" />);
  expect(screen.getByLabelText('Bio')).not.toHaveProp('accessibilityHint');
});

it.each([true, false, 'true', 'false', 'grammar', 'spelling'] as const)(
  'preserves explicit aria-invalid=%s independently of the error prop',
  async (invalid) => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const { rerender } = await render(
      <TextInput label="Email" aria-invalid={invalid} render={renderInput} />
    );
    expect(renderInput.mock.lastCall?.[0]['aria-invalid']).toBe(invalid);

    await rerender(
      <TextInput
        label="Email"
        aria-invalid={invalid}
        error
        render={renderInput}
      />
    );
    expect(renderInput.mock.lastCall?.[0]['aria-invalid']).toBe(invalid);

    await rerender(<TextInput label="Email" error render={renderInput} />);
    expect(renderInput.mock.lastCall?.[0]['aria-invalid']).toBe(true);

    await rerender(<TextInput label="Email" render={renderInput} />);
    expect(renderInput.mock.lastCall?.[0]['aria-invalid']).toBe(false);
  }
);

it('announces each changed error message once on iOS', async () => {
  jest.replaceProperty(Platform, 'OS', 'ios');
  const announce = jest
    .spyOn(AccessibilityInfo, 'announceForAccessibility')
    .mockClear();
  const { rerender } = await render(
    <TextInput label="Email" supportingText="Optional" />
  );
  expect(announce).not.toHaveBeenCalled();

  await rerender(
    <TextInput label="Email" supportingText="Invalid address" error />
  );
  expect(announce).toHaveBeenLastCalledWith('Invalid address');
  await rerender(
    <TextInput label="Email" supportingText="Invalid address" error value="a" />
  );
  expect(announce).toHaveBeenCalledTimes(1);
  await rerender(
    <TextInput label="Email" supportingText="Address is required" error />
  );
  expect(announce).toHaveBeenLastCalledWith('Address is required');
  await rerender(<TextInput label="Email" supportingText="Optional" />);
  expect(announce).toHaveBeenCalledTimes(2);
});

it('uses an assertive Android live region for an error', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  await render(
    <TextInput label="Email" supportingText="Invalid address" error />
  );
  expect(screen.getByRole('alert')).toHaveProp(
    'accessibilityLiveRegion',
    'assertive'
  );
});

it('uses a native Android live region for counter updates', async () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  await render(<TextInput label="Email" counter maxLength={40} />);
  expect(screen.getByText('0/40')).toHaveProp(
    'accessibilityLiveRegion',
    'polite'
  );
});

it('keeps a disabled native input read-only when readOnly is explicitly false', async () => {
  await render(
    <TextInput label="Email" disabled readOnly={false} render={renderInput} />
  );
  expect(renderInput.mock.lastCall?.[0].editable).toBe(false);
  expect(renderInput.mock.lastCall?.[0].readOnly).toBe(true);
});

it.each(['onLongPress', 'onPressIn', 'onPressOut'] as const)(
  'preserves an accessory using only %s',
  async (handler) => {
    const onAction = jest.fn<() => void>();
    await render(
      <TextInput
        label="Search"
        endAccessory={(props) => (
          <TextInput.Icon
            {...props}
            icon="magnify"
            aria-label="Search action"
            {...{ [handler]: onAction }}
          />
        )}
      />
    );
    await userEvent.longPress(
      screen.getByRole('button', { name: 'Search action' })
    );
    expect(onAction).toHaveBeenCalledTimes(1);
  }
);

it('renders decorative accessories outside the accessibility tree without buttons', async () => {
  await render(
    <TextInput
      label="Search"
      startAccessory={(props) => <TextInput.Icon {...props} icon="magnify" />}
      endAccessory={(props) => <TextInput.Icon {...props} icon="account" />}
    />
  );
  expect(screen.queryAllByRole('button')).toHaveLength(0);
  expect(screen.queryByText('magnify')).toBeNull();
  expect(
    screen.getByText('magnify', { includeHiddenElements: true })
  ).toBeOnTheScreen();
});

it('preserves decorative loading and container visuals without accessible controls', async () => {
  await render(
    <TextInput
      label="Search"
      endAccessory={(props) => (
        <TextInput.Icon
          {...props}
          icon="magnify"
          loading
          mode="outlined"
          containerColor="pink"
          contentStyle={{ padding: 2 }}
          testID="search-decoration"
        />
      )}
    />
  );
  expect(screen.queryAllByRole('button')).toHaveLength(0);
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(
    screen.getByRole('progressbar', { includeHiddenElements: true })
  ).toBeOnTheScreen();
  expect(
    screen.getByTestId('search-decoration-container', {
      includeHiddenElements: true,
    })
  ).toHaveStyle({ backgroundColor: 'pink', borderWidth: 1 });
  expect(
    screen.getByTestId('search-decoration', { includeHiddenElements: true })
  ).toHaveStyle({ padding: 2 });
});

it('keeps a named disabled accessory inoperable', async () => {
  const onPress = jest.fn<() => void>();
  await render(
    <TextInput
      label="Search"
      disabled
      endAccessory={(props) => (
        <TextInput.Icon
          {...props}
          icon="close"
          aria-label="Clear search"
          onPress={onPress}
        />
      )}
    />
  );
  const button = screen.getByRole('button', { name: 'Clear search' });
  expect(button).toBeDisabled();
  await userEvent.press(button);
  expect(onPress).not.toHaveBeenCalled();
});

it('blocks every accessory activation handler when the field is disabled', async () => {
  const onPress = jest.fn<() => void>();
  const onLongPress = jest.fn<() => void>();
  const onPressIn = jest.fn();
  const onPressOut = jest.fn();
  await render(
    <TextInput
      label="Search"
      disabled
      endAccessory={(props) => (
        <TextInput.Icon
          {...props}
          icon="close"
          aria-label="Clear search"
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      )}
    />
  );
  const button = screen.getByRole('button', { name: 'Clear search' });
  await userEvent.longPress(button);
  expect(onPress).not.toHaveBeenCalled();
  expect(onLongPress).not.toHaveBeenCalled();
  expect(onPressIn).not.toHaveBeenCalled();
  expect(onPressOut).not.toHaveBeenCalled();
});

it.each(['aria-labelledby', 'accessibilityLabelledBy'] as const)(
  'preserves caller %s relationships',
  async (attribute) => {
    await render(
      <>
        <Text nativeID="external-label">Work address</Text>
        <TextInput
          label="Email"
          {...{ [attribute]: 'external-label' }}
          supportingText="Use your work address"
          render={renderInput}
        />
      </>
    );
    expect(renderInput.mock.lastCall?.[0][attribute]).toBe('external-label');
    expect(renderInput.mock.lastCall?.[0]['aria-describedby']).toEqual(
      expect.any(String)
    );
  }
);

it('forwards decorative accessory layout callbacks and native IDs', async () => {
  const onLayout = jest.fn();
  await render(
    <TextInput
      label="Search"
      startAccessory={(props) => (
        <TextInput.Icon
          {...props}
          icon="magnify"
          testID="decoration"
          nativeID="search-icon"
          onLayout={onLayout}
        />
      )}
    />
  );
  const icon = screen.getByTestId('decoration', {
    includeHiddenElements: true,
  });
  expect(icon).toHaveProp('nativeID', 'search-icon');
  expect(icon).toHaveProp('onLayout', onLayout);
});
