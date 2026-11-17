import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import { LightTheme as theme } from '../../theme/schemes';
import TextInput from '../TextInput';
import { getOutlineColor } from '../TextInput/utils';

type State = {
  isFocused?: boolean;
  isHovered?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
};

describe.each([
  { variant: 'filled', restingRole: 'onSurfaceVariant' },
  { variant: 'outlined', restingRole: 'outline' },
] as const)('$variant indicator', ({ variant, restingRole }) => {
  it.each<{ state: string; props: State; role: keyof typeof theme.colors }>([
    { state: 'at rest', props: {}, role: restingRole },
    { state: 'when hovered', props: { isHovered: true }, role: 'onSurface' },
    { state: 'when focused', props: { isFocused: true }, role: 'primary' },
    {
      state: 'when focused and hovered',
      props: { isFocused: true, isHovered: true },
      role: 'primary',
    },
    { state: 'when invalid', props: { hasError: true }, role: 'error' },
    {
      state: 'when invalid and hovered',
      props: { hasError: true, isHovered: true },
      role: 'onErrorContainer',
    },
    {
      state: 'when invalid, focused and hovered',
      props: { hasError: true, isFocused: true, isHovered: true },
      role: 'error',
    },
    { state: 'when disabled', props: { isDisabled: true }, role: 'onSurface' },
    {
      state: 'when disabled, invalid and hovered',
      props: { isDisabled: true, hasError: true, isHovered: true },
      role: 'onSurface',
    },
  ])('uses $role $state', ({ props, role }) => {
    expect(
      getOutlineColor({
        theme,
        variant,
        isFocused: false,
        hasError: false,
        isDisabled: false,
        ...props,
      })
    ).toBe(theme.colors[role]);
  });
});

it('uses the disabled colors for a disabled invalid field and keeps it invalid', async () => {
  await render(
    <TextInput
      label="Email"
      supportingText="Enter a valid email"
      error
      disabled
      startAccessory={(props) => <TextInput.Icon {...props} icon="email" />}
    />
  );

  // Label, supporting text, accessory icon and the default error icon.
  for (const text of [
    'Email',
    'Enter a valid email',
    'email',
    'alert-circle',
  ]) {
    expect(screen.getByText(text, { includeHiddenElements: true })).toHaveStyle(
      { color: theme.colors.onSurface }
    );
  }
  expect(screen.getByLabelText('Email')).toHaveProp('aria-invalid', true);
});
