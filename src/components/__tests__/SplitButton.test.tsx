import * as React from 'react';
import { StyleSheet } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import SplitButton from '../SplitButton/SplitButton';

const styles = StyleSheet.create({
  button: {
    opacity: 0.9,
  },
  leading: {
    minWidth: 120,
  },
  trailing: {
    minWidth: 64,
  },
  label: {
    fontSize: 18,
  },
});

const segments = ['leading', 'trailing'] as const;
const modes = ['filled', 'tonal', 'elevated'] as const;

const renderSplitButton = (
  props: Partial<React.ComponentProps<typeof SplitButton>> = {}
) =>
  render(
    <SplitButton
      testID="split-button"
      label="Send"
      onPress={() => {}}
      onTrailingPress={() => {}}
      {...props}
    />
  );

it('renders the label text', async () => {
  await renderSplitButton();

  expect(screen.getByTestId('split-button-label')).toHaveTextContent('Send');
});

it('applies the default container height', async () => {
  await renderSplitButton();

  expect(screen.getByTestId('split-button-container')).toHaveStyle({
    height: 40,
  });
});

it.each(segments)('renders the %s segment', async (segment) => {
  await renderSplitButton();

  expect(screen.getByTestId(`split-button-${segment}-container`)).toBeTruthy();
});

it.each(segments)(
  'calls the %s press handler on its own press',
  async (segment) => {
    const user = userEvent.setup();
    const propName = segment === 'leading' ? 'onPress' : 'onTrailingPress';
    const handler = jest.fn();
    await renderSplitButton({ [propName]: handler });

    await user.press(screen.getByTestId(`split-button-${segment}`));

    expect(handler).toHaveBeenCalledTimes(1);
  }
);

it.each(segments)(
  'calls the %s press-in handler separately',
  async (segment) => {
    const propName = segment === 'leading' ? 'onPressIn' : 'onTrailingPressIn';
    const handler = jest.fn();
    await renderSplitButton({ [propName]: handler });

    await fireEvent(screen.getByTestId(`split-button-${segment}`), 'onPressIn');

    expect(handler).toHaveBeenCalledTimes(1);
  }
);

it.each(segments)(
  'calls the %s press-out handler separately',
  async (segment) => {
    const propName =
      segment === 'leading' ? 'onPressOut' : 'onTrailingPressOut';
    const handler = jest.fn();
    await renderSplitButton({ [propName]: handler });

    await fireEvent(
      screen.getByTestId(`split-button-${segment}`),
      'onPressOut'
    );

    expect(handler).toHaveBeenCalledTimes(1);
  }
);

it.each(segments)(
  'keeps the outline color at full opacity for a disabled outlined %s segment',
  async (segment) => {
    const theme = getTheme();
    await renderSplitButton({ mode: 'outlined', disabled: true });

    expect(screen.getByTestId(`split-button-${segment}-container`)).toHaveStyle(
      {
        borderColor: theme.colors.outlineVariant,
      }
    );
  }
);

it.each(segments)(
  'applies the filled mode container color to the %s segment',
  async (segment) => {
    const theme = getTheme();
    await renderSplitButton({ mode: 'filled' });

    expect(
      screen.getByTestId(`split-button-${segment}-background`)
    ).toHaveStyle({
      backgroundColor: theme.colors.primary,
    });
  }
);

it.each(segments)(
  'applies the tonal mode container color to the %s segment',
  async (segment) => {
    const theme = getTheme();
    await renderSplitButton({ mode: 'tonal' });

    expect(
      screen.getByTestId(`split-button-${segment}-background`)
    ).toHaveStyle({
      backgroundColor: theme.colors.secondaryContainer,
    });
  }
);

it.each(segments)(
  'applies the elevated mode container color to the %s segment',
  async (segment) => {
    const theme = getTheme();
    await renderSplitButton({ mode: 'elevated' });

    expect(
      screen.getByTestId(`split-button-${segment}-background`)
    ).toHaveStyle({
      backgroundColor: theme.colors.surfaceContainerLow,
    });
  }
);

it.each(segments)(
  'applies a transparent container and visible border to the %s segment in outlined mode',
  async (segment) => {
    const theme = getTheme();
    await renderSplitButton({ mode: 'outlined' });

    expect(screen.getByTestId(`split-button-${segment}-container`)).toHaveStyle(
      {
        backgroundColor: 'transparent',
        borderColor: theme.colors.outlineVariant,
      }
    );
  }
);

it.each(
  segments.flatMap((segment) =>
    modes.map((mode) => [segment, mode] as [string, (typeof modes)[number]])
  )
)(
  'dims the %s background to a disabled onSurface tint in %s mode',
  async (segment, mode) => {
    const theme = getTheme();
    await renderSplitButton({ mode, disabled: true });

    expect(
      screen.getByTestId(`split-button-${segment}-disabled-background`)
    ).toHaveStyle({
      backgroundColor: theme.colors.onSurface,
      opacity: 0.1,
    });
  }
);

it.each(segments)(
  'fades out the %s enabled background when disabled',
  async (segment) => {
    await renderSplitButton({ mode: 'filled', disabled: true });

    expect(
      screen.getByTestId(`split-button-${segment}-background`)
    ).toHaveStyle({
      opacity: 0,
    });
  }
);

it.each(
  segments.flatMap((segment) =>
    modes.map((mode) => [segment, mode] as [string, (typeof modes)[number]])
  )
)(
  'keeps the %s container transparent when disabled in %s mode',
  async (segment, mode) => {
    await renderSplitButton({ mode, disabled: true });

    expect(screen.getByTestId(`split-button-${segment}-container`)).toHaveStyle(
      {
        backgroundColor: 'transparent',
      }
    );
  }
);

it.each(segments)(
  'applies the custom button color to the %s segment',
  async (segment) => {
    await renderSplitButton({ buttonColor: 'purple' });

    expect(
      screen.getByTestId(`split-button-${segment}-background`)
    ).toHaveStyle({
      backgroundColor: 'purple',
    });
  }
);

it('applies the custom text color to the label', async () => {
  await renderSplitButton({ textColor: 'yellow' });

  expect(screen.getByTestId('split-button-label')).toHaveStyle({
    color: 'yellow',
  });
});

it('applies the container height for the extra-small size', async () => {
  await renderSplitButton({ size: 'extra-small' });

  expect(screen.getByTestId('split-button-container')).toHaveStyle({
    height: 32,
  });
});

it('applies the container height for the large size', async () => {
  await renderSplitButton({ size: 'large' });

  expect(screen.getByTestId('split-button-container')).toHaveStyle({
    height: 96,
  });
});

it('shows a progress indicator instead of the icon while loading', async () => {
  await renderSplitButton({ icon: 'send', loading: true });

  expect(screen.getByRole('progressbar')).toBeTruthy();
});

it('defaults the leading accessibility label to the label prop', async () => {
  await renderSplitButton();

  expect(screen.getByTestId('split-button-leading')).toHaveProp(
    'accessibilityLabel',
    'Send'
  );
});

it('defaults the trailing accessibility label to "Show options"', async () => {
  await renderSplitButton();

  expect(screen.getByTestId('split-button-trailing')).toHaveProp(
    'accessibilityLabel',
    'Show options'
  );
});

it.each(segments)(
  'calls the %s long-press handler separately',
  async (segment) => {
    const user = userEvent.setup();
    const propName =
      segment === 'leading' ? 'onLongPress' : 'onTrailingLongPress';
    const handler = jest.fn();
    await renderSplitButton({ [propName]: handler });

    await user.longPress(screen.getByTestId(`split-button-${segment}`));

    expect(handler).toHaveBeenCalledTimes(1);
  }
);

it('does not change the trailing background color when selected', async () => {
  // Per the M3 spec, the trailing button's color doesn't change when
  // selected — only a state layer, tinted with the container's own "on"
  // color, is applied on top of it.
  const theme = getTheme();
  await renderSplitButton({
    mode: 'filled',
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByTestId('split-button-trailing-background')).toHaveStyle({
    backgroundColor: theme.colors.primary,
  });
});

it('applies a state layer tinted with the "on" color when selected', async () => {
  const theme = getTheme();
  await renderSplitButton({
    mode: 'filled',
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByTestId('split-button-trailing-state-layer')).toHaveStyle({
    backgroundColor: theme.colors.onPrimary,
    opacity: 0.1,
  });
});

it('does not affect the leading segment when the trailing segment is selected', async () => {
  const theme = getTheme();
  await renderSplitButton({
    mode: 'filled',
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByTestId('split-button-leading-background')).toHaveStyle({
    backgroundColor: theme.colors.primary,
  });
});

it('hides the state layer when not selected', async () => {
  await renderSplitButton({
    trailingAccessibilityState: { expanded: false },
  });

  expect(screen.getByTestId('split-button-trailing-state-layer')).toHaveStyle({
    opacity: 0,
  });
});

it('hides the state layer when disabled, even if selected', async () => {
  await renderSplitButton({
    disabled: true,
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByTestId('split-button-trailing-state-layer')).toHaveStyle({
    opacity: 0,
  });
});

it.each(segments)(
  'marks the %s press target disabled when disabled',
  async (segment) => {
    await renderSplitButton({ disabled: true });

    expect(screen.getByTestId(`split-button-${segment}`)).toBeDisabled();
  }
);

it.each([
  ['leading', styles.leading],
  ['trailing', styles.trailing],
])(
  'passes buttonStyle and its own segment style to the %s container',
  async (segment, segmentStyle) => {
    await renderSplitButton({
      buttonStyle: styles.button,
      leadingButtonStyle: styles.leading,
      trailingButtonStyle: styles.trailing,
    });

    expect(screen.getByTestId(`split-button-${segment}-container`)).toHaveStyle(
      {
        ...styles.button,
        ...segmentStyle,
      }
    );
  }
);

it('passes labelStyle to the label', async () => {
  await renderSplitButton({ labelStyle: styles.label });

  expect(screen.getByTestId('split-button-label')).toHaveStyle(styles.label);
});

it('passes custom accessibility state to the leading button', async () => {
  await renderSplitButton({
    accessibilityState: { checked: true },
  });

  expect(screen.getByTestId('split-button-leading')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({ checked: true })
  );
});

it('merges trailing accessibility state with expanded state', async () => {
  await renderSplitButton({
    trailingAccessibilityState: { expanded: true },
  });

  expect(screen.getByTestId('split-button-trailing')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({ expanded: true })
  );
});

it.each([
  'split-button-container',
  'split-button-leading',
  'split-button-trailing',
])('does not add the %s test ID unless testID is provided', async (testID) => {
  await render(
    <SplitButton label="Send" onPress={() => {}} onTrailingPress={() => {}} />
  );

  expect(screen.queryByTestId(testID)).toBeNull();
});
