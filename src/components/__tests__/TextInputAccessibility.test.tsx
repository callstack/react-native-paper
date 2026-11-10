import type { ComponentRef } from 'react';
import {
  AccessibilityInfo,
  Text,
  Platform,
  TextInput as NativeTextInput,
} from 'react-native';
import type { View } from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';

import { act, fireEvent, render, screen, userEvent } from '../../test-utils';
import TextInput from '../TextInput';
import { ERROR_ANNOUNCEMENT_DELAY_MS } from '../TextInput/constants';
import type {
  TextInputProps,
  TextInputRenderProps,
} from '../TextInput/TextInput';

const renderInput = jest.fn((props: TextInputRenderProps) => (
  <NativeTextInput {...props} />
));

afterEach(() => {
  jest.restoreAllMocks();
  renderInput.mockClear();
});

it.each(['filled', 'outlined'] as const)(
  'uses the placeholder as the name of an unlabelled %s field, including after typing',
  async (variant) => {
    await render(<TextInput variant={variant} placeholder="Search" />);

    const input = screen.getByLabelText('Search');
    await userEvent.type(input, 'Paper');
    expect(screen.getByLabelText('Search')).toHaveDisplayValue('Paper');
  }
);

it.each([
  { label: 'Search products' },
  { 'aria-label': 'Search products' },
  { accessibilityLabel: 'Search products' },
])('prefers a supplied name over the placeholder: %j', async (props) => {
  await render(<TextInput {...props} placeholder="Search" />);

  expect(screen.getByLabelText('Search products')).toBeOnTheScreen();
  expect(screen.queryByLabelText('Search')).toBeNull();
});

it.each([
  { disabled: true, 'aria-disabled': false, expectedDisabled: true },
  { disabled: true, 'aria-disabled': true, expectedDisabled: true },
  { disabled: false, 'aria-disabled': true, expectedDisabled: true },
  { disabled: false, 'aria-disabled': false, expectedDisabled: false },
])(
  'keeps the disabled semantics consistent: %j',
  async ({ expectedDisabled, ...props }) => {
    await render(<TextInput {...props} label="Email" readOnly />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveProp('aria-disabled', expectedDisabled);
  }
);

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
  const ref = jest.fn<(instance: ComponentRef<typeof View> | null) => void>();
  const props = {
    icon: 'magnify',
    style: {},
    disabled: false,
    error: false,
    multiline: false,
    ref,
  };
  const { rerender, unmount } = await render(<TextInput.Icon {...props} />);
  expect(ref).toHaveBeenCalledTimes(1);
  expect(ref).toHaveBeenLastCalledWith(
    expect.objectContaining({ measure: expect.any(Function) })
  );

  await rerender(
    <TextInput.Icon {...props} onPress={() => {}} aria-label="Search" />
  );
  await rerender(<TextInput.Icon {...props} />);
  expect(ref).toHaveBeenCalledTimes(1);

  await unmount();
  expect(ref).toHaveBeenLastCalledWith(null);
});

it.each(['filled', 'outlined'] as const)(
  'associates helper and counter on web without changing the %s field name',
  async (variant) => {
    jest.replaceProperty(Platform, 'OS', 'web');
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
  jest.replaceProperty(Platform, 'OS', 'web');
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
  jest.replaceProperty(Platform, 'OS', 'web');
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
  jest.replaceProperty(Platform, 'OS', 'web');
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
  'reads field descriptions only from the native hint on %s',
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
    const input = screen.getByLabelText('Bio');
    expect(input).toHaveProp(
      'accessibilityHint',
      'Double tap to edit, Keep it short, Characters entered 2 of 20'
    );
    expect(input).not.toHaveProp('aria-describedby');
    expect(screen.queryByText('Keep it short')).toBeNull();
    expect(screen.queryByText('2/20')).toBeNull();
    for (const text of ['Keep it short', '2/20']) {
      expect(
        screen.getByText(text, { includeHiddenElements: true })
      ).not.toHaveProp('nativeID');
    }
  }
);

it.each(['ios', 'android'] as const)(
  'reads the placeholder of an empty labelled field from the hint on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await render(
      <TextInput
        label="Email"
        accessibilityHint="Signs you in"
        placeholder="name@example.com"
        supportingText="Use a work address"
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveProp(
      'accessibilityHint',
      'Signs you in, name@example.com, Use a work address'
    );
    expect(
      screen.queryByText('name@example.com', { includeHiddenElements: true })
    ).toBeNull();

    await userEvent.type(input, 'a');
    expect(input).toHaveProp(
      'accessibilityHint',
      'Signs you in, Use a work address'
    );
  }
);

it('describes an empty labelled field with its placeholder on web until the input shows it', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(
    <TextInput
      label="Email"
      placeholder="name@example.com"
      supportingText="Use a work address"
      render={renderInput}
    />
  );
  const input = screen.getByLabelText('Email');
  const getDescriptionIds = () =>
    renderInput.mock.lastCall?.[0]['aria-describedby']?.split(' ') ?? [];
  const ids = getDescriptionIds();

  expect(input).toHaveProp('placeholder', '');
  expect(ids).toHaveLength(2);
  expect(screen.queryByText('name@example.com')).toBeNull();
  expect(
    screen.getByText('name@example.com', { includeHiddenElements: true })
  ).toHaveProp('nativeID', ids[0]);
  expect(screen.getByText('Use a work address')).toHaveProp('nativeID', ids[1]);

  await fireEvent(input, 'focus');
  await act(() => jest.advanceTimersByTimeAsync(1000));

  // The input exposes its own placeholder now, so it is not read twice.
  expect(input).toHaveProp('placeholder', 'name@example.com');
  expect(getDescriptionIds()).toEqual([ids[1]]);
  expect(
    screen.queryByText('name@example.com', { includeHiddenElements: true })
  ).toBeNull();
});

it.each<TextInputProps>([
  { label: 'Email', defaultValue: 'a' },
  { 'aria-label': 'Email' },
])(
  'does not describe the field with a placeholder the input shows on web: %j',
  async (props) => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(
      <TextInput
        {...props}
        placeholder="name@example.com"
        render={renderInput}
      />
    );

    expect(renderInput.mock.lastCall?.[0]['aria-describedby']).toBeUndefined();
    expect(
      screen.queryByText('name@example.com', { includeHiddenElements: true })
    ).toBeNull();
  }
);

it.each(['ios', 'android'] as const)(
  'leaves the placeholder of an unlabelled field out of the hint on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await render(
      <TextInput aria-label="Email" placeholder="name@example.com" />
    );
    expect(screen.getByLabelText('Email')).not.toHaveProp('accessibilityHint');
  }
);

it('describes the field on web with its prefix and suffix instead of exposing them', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(
    <TextInput
      label="Weight"
      defaultValue="5"
      prefix="~"
      suffix=" kg"
      supportingText="Packed weight"
      render={renderInput}
    />
  );
  const ids =
    renderInput.mock.lastCall?.[0]['aria-describedby']?.split(' ') ?? [];

  expect(ids).toHaveLength(3);
  expect(screen.queryByText('~')).toBeNull();
  expect(screen.queryByText(' kg')).toBeNull();
  expect(screen.getByText('~', { includeHiddenElements: true })).toHaveProp(
    'nativeID',
    ids[0]
  );
  expect(screen.getByText(' kg', { includeHiddenElements: true })).toHaveProp(
    'nativeID',
    ids[1]
  );
  expect(screen.getByText('Packed weight')).toHaveProp('nativeID', ids[2]);
});

it('does not reference a prefix or suffix that is not rendered on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(
    <TextInput label="Weight" prefix="~" suffix=" kg" render={renderInput} />
  );

  expect(screen.queryByText('~', { includeHiddenElements: true })).toBeNull();
  expect(renderInput.mock.lastCall?.[0]['aria-describedby']).toBeUndefined();
});

it.each(['ios', 'android'] as const)(
  'reads the prefix and suffix from the hint instead of as separate text on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await render(
      <TextInput
        label="Weight"
        placeholder="0.0"
        prefix="~"
        suffix=" kg"
        supportingText="Packed weight"
      />
    );
    const input = screen.getByLabelText('Weight');
    expect(input).toHaveProp('accessibilityHint', '0.0, ~, kg, Packed weight');

    await userEvent.type(input, '5');
    expect(input).toHaveProp('accessibilityHint', '~, kg, Packed weight');
    expect(screen.queryByText('~')).toBeNull();
    expect(screen.queryByText(' kg')).toBeNull();
    expect(
      screen.getByText('~', { includeHiddenElements: true })
    ).not.toHaveProp('nativeID');
  }
);

it('uses web descriptions without duplicating them in a hint', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(
    <TextInput
      label="Bio"
      supportingText="Keep it short"
      counter
      maxLength={20}
    />
  );
  expect(screen.getByLabelText('Bio')).not.toHaveProp('accessibilityHint');
  expect(screen.getByText('Keep it short')).toBeOnTheScreen();
  expect(screen.getByLabelText('Characters entered 0 of 20')).toHaveProp(
    'aria-live',
    'polite'
  );
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

const settleError = () =>
  act(() => jest.advanceTimersByTime(ERROR_ANNOUNCEMENT_DELAY_MS));

const spyOnAnnounce = () =>
  jest
    .spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions')
    .mockClear();

it.each(['ios', 'android'] as const)(
  'announces each changed error message once on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = spyOnAnnounce();
    const { rerender } = await render(
      <TextInput label="Email" supportingText="Optional" />
    );
    await settleError();
    expect(announce).not.toHaveBeenCalled();

    await rerender(
      <TextInput label="Email" supportingText="Invalid address" error />
    );
    await settleError();
    expect(announce).toHaveBeenLastCalledWith('Invalid address', {
      queue: true,
    });
    await rerender(
      <TextInput
        label="Email"
        supportingText="Invalid address"
        error
        value="a"
      />
    );
    await settleError();
    expect(announce).toHaveBeenCalledTimes(1);
    await rerender(
      <TextInput label="Email" supportingText="Address is required" error />
    );
    await settleError();
    expect(announce).toHaveBeenLastCalledWith('Address is required', {
      queue: true,
    });
    await rerender(<TextInput label="Email" supportingText="Optional" />);
    await settleError();
    expect(announce).toHaveBeenCalledTimes(2);
  }
);

it.each(['ios', 'android'] as const)(
  'does not announce an error that is shown on mount on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = spyOnAnnounce();
    const { rerender } = await render(
      <TextInput label="Email" supportingText="Invalid address" error />
    );
    await settleError();
    expect(announce).not.toHaveBeenCalled();

    await rerender(
      <TextInput label="Email" supportingText="Address is required" error />
    );
    await settleError();
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenLastCalledWith('Address is required', {
      queue: true,
    });
  }
);

it.each(['ios', 'android'] as const)(
  'waits for the error to stop changing and announces only the last one on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = spyOnAnnounce();
    const { rerender } = await render(<TextInput label="Code" />);

    for (const remaining of [5, 4, 3]) {
      await rerender(
        <TextInput
          label="Code"
          supportingText={`Enter ${remaining} more digits`}
          error
        />
      );
      await act(() =>
        jest.advanceTimersByTime(ERROR_ANNOUNCEMENT_DELAY_MS - 1)
      );
    }
    expect(announce).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(1));
    expect(announce.mock.calls).toEqual([
      ['Enter 3 more digits', { queue: true }],
    ]);
  }
);

it.each(['ios', 'android'] as const)(
  'announces a message that stays the same while typing a second after it appears on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = spyOnAnnounce();
    const invalid = (value: string) => (
      <TextInput
        label="Password"
        supportingText="Use at least 8 characters"
        error
        value={value}
      />
    );
    const { rerender } = await render(<TextInput label="Password" />);

    await rerender(invalid('a'));
    await act(() => jest.advanceTimersByTime(ERROR_ANNOUNCEMENT_DELAY_MS - 1));
    await rerender(invalid('ab'));
    await act(() => jest.advanceTimersByTime(1));
    expect(announce.mock.calls).toEqual([
      ['Use at least 8 characters', { queue: true }],
    ]);
  }
);

it.each(['ios', 'android'] as const)(
  'does not announce an error that clears before it settles on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = spyOnAnnounce();
    const { rerender, unmount } = await render(<TextInput label="Email" />);

    await rerender(
      <TextInput label="Email" supportingText="Invalid address" error />
    );
    await rerender(<TextInput label="Email" />);
    await settleError();
    expect(announce).not.toHaveBeenCalled();

    await rerender(
      <TextInput label="Email" supportingText="Invalid address" error />
    );
    await unmount();
    await settleError();
    expect(announce).not.toHaveBeenCalled();
  }
);

it.each(['ios', 'android'] as const)(
  'announces an error again only after it stays cleared on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = spyOnAnnounce();
    const invalid = (
      <TextInput label="Email" supportingText="Invalid address" error />
    );
    const valid = <TextInput label="Email" supportingText="Optional" />;
    const { rerender } = await render(valid);

    await rerender(invalid);
    await settleError();
    expect(announce).toHaveBeenCalledTimes(1);

    await rerender(valid);
    await rerender(invalid);
    await settleError();
    expect(announce).toHaveBeenCalledTimes(1);

    await rerender(valid);
    await settleError();
    await rerender(invalid);
    await settleError();
    expect(announce).toHaveBeenCalledTimes(2);
  }
);

const makeTwoFieldsInvalid = async () => {
  const announce = spyOnAnnounce();
  const { rerender } = await render(
    <>
      <TextInput label="Email" supportingText="Optional" />
      <TextInput label="Password" supportingText="Optional" />
    </>
  );

  await rerender(
    <>
      <TextInput label="Email" supportingText="Invalid address" error />
      <TextInput label="Password" supportingText="Password is required" error />
    </>
  );
  await settleError();

  return announce;
};

it.each(['ios', 'android'] as const)(
  'announces the error of each field that becomes invalid in the same update on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const announce = await makeTwoFieldsInvalid();
    expect(announce.mock.calls.map(([message]) => message)).toEqual([
      'Invalid address',
      'Password is required',
    ]);
  }
);

it('queues the error announcements on iOS so they do not cut each other off', async () => {
  jest.replaceProperty(Platform, 'OS', 'ios');
  const announce = await makeTwoFieldsInvalid();
  expect(announce.mock.calls).toEqual([
    ['Invalid address', { queue: true }],
    ['Password is required', { queue: true }],
  ]);
});

it('announces errors on web through the alert role', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const announce = spyOnAnnounce();
  const { rerender } = await render(
    <TextInput label="Email" supportingText="Optional" />
  );
  expect(screen.queryByRole('alert')).toBeNull();

  await rerender(
    <TextInput label="Email" supportingText="Invalid address" error />
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid address');
  await settleError();
  expect(announce).not.toHaveBeenCalled();
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

const accessoryNameWarning =
  'TextInput.Icon: an actionable icon requires an aria-label or accessibilityLabel.';

it.each([
  { name: 'no', label: undefined },
  { name: 'a blank', label: '  ' },
])(
  'warns when an actionable accessory has $name accessible name',
  async ({ label }) => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(
      <TextInput
        label="Search"
        endAccessory={(props) => (
          <TextInput.Icon
            {...props}
            icon="close"
            aria-label={label}
            onPress={() => {}}
          />
        )}
      />
    );
    expect(warn).toHaveBeenCalledWith(accessoryNameWarning);
  }
);

it.each<{
  accessory: string;
  endAccessory: NonNullable<TextInputProps['endAccessory']>;
}>([
  {
    accessory: 'a decorative accessory',
    endAccessory: (props) => <TextInput.Icon {...props} icon="magnify" />,
  },
  {
    accessory: 'a named actionable accessory',
    endAccessory: (props) => (
      <TextInput.Icon
        {...props}
        icon="close"
        aria-label="Clear search"
        onPress={() => {}}
      />
    ),
  },
])('does not warn for $accessory', async ({ endAccessory }) => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await render(<TextInput label="Search" endAccessory={endAccessory} />);
  expect(warn).not.toHaveBeenCalled();
});

it('does not warn for an unnamed actionable accessory in production', async () => {
  jest.replaceProperty(process.env, 'NODE_ENV', 'production');
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await render(
    <TextInput
      label="Search"
      endAccessory={(props) => (
        <TextInput.Icon {...props} icon="close" onPress={() => {}} />
      )}
    />
  );
  expect(warn).not.toHaveBeenCalled();
});

it.each(['ios', 'android', 'web'] as const)(
  'renders decorative accessories outside the accessibility tree without buttons on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await render(
      <TextInput
        label="Search"
        startAccessory={(props) => (
          <TextInput.Icon {...props} icon="magnify" testID="search-icon" />
        )}
        endAccessory={(props) => (
          <TextInput.Icon
            {...props}
            icon="account"
            aria-label="Account"
            testID="account-icon"
          />
        )}
      />
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    for (const testID of ['search-icon', 'account-icon']) {
      expect(screen.queryByTestId(testID)).toBeNull();
      const icon = screen.getByTestId(testID, { includeHiddenElements: true });
      expect(icon).toBeOnTheScreen();
      // Not a keyboard focus stop either.
      expect(icon).not.toHaveProp('focusable', true);
      expect(icon).not.toHaveProp('tabIndex', 0);
    }
  }
);

it('preserves decorative loading and content styles without accessible controls', async () => {
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
    jest.replaceProperty(Platform, 'OS', 'web');
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
    expect(screen.getByLabelText('Work address')).toHaveProp(
      attribute,
      'external-label'
    );
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
