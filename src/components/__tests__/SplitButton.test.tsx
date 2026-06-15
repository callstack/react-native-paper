import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fireEvent } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
import SplitButton from '../SplitButton/SplitButton';
import {
  getSplitButtonColors,
  getSplitButtonHitSlop,
  getSplitButtonLeadingShape,
  getSplitButtonSizeStyle,
  getSplitButtonTrailingShape,
  normalizeSplitButtonMode,
} from '../SplitButton/utils';

const styles = StyleSheet.create({
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

it('renders a filled split button by default', () => {
  const { getByTestId } = render(
    <SplitButton label="Send" onPress={() => {}} onTrailingPress={() => {}} />
  );

  expect(getByTestId('split-button-label')).toHaveTextContent('Send');
  expect(getByTestId('split-button-container')).toHaveStyle({
    height: 40,
  });
  expect(getByTestId('split-button-leading-container')).toBeTruthy();
  expect(getByTestId('split-button-trailing-container')).toBeTruthy();
});

it('calls leading and trailing press handlers separately', () => {
  const onPress = jest.fn();
  const onTrailingPress = jest.fn();
  const { getByTestId } = render(
    <SplitButton
      label="Send"
      onPress={onPress}
      onTrailingPress={onTrailingPress}
    />
  );

  fireEvent.press(getByTestId('split-button-leading'));
  fireEvent.press(getByTestId('split-button-trailing'));

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onTrailingPress).toHaveBeenCalledTimes(1);
});

it('calls leading and trailing press-in and press-out handlers separately', () => {
  const onPress = jest.fn();
  const onPressIn = jest.fn();
  const onPressOut = jest.fn();
  const onTrailingPress = jest.fn();
  const onTrailingPressIn = jest.fn();
  const onTrailingPressOut = jest.fn();
  const { getByTestId } = render(
    <SplitButton
      label="Send"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onTrailingPress={onTrailingPress}
      onTrailingPressIn={onTrailingPressIn}
      onTrailingPressOut={onTrailingPressOut}
    />
  );

  fireEvent(getByTestId('split-button-leading'), 'onPressIn');
  fireEvent(getByTestId('split-button-leading'), 'onPressOut');
  fireEvent(getByTestId('split-button-trailing'), 'onPressIn');
  fireEvent(getByTestId('split-button-trailing'), 'onPressOut');

  expect(onPressIn).toHaveBeenCalledTimes(1);
  expect(onPressOut).toHaveBeenCalledTimes(1);
  expect(onTrailingPressIn).toHaveBeenCalledTimes(1);
  expect(onTrailingPressOut).toHaveBeenCalledTimes(1);
});

it('uses pressed inner-corner tokens for the active side', () => {
  const theme = getTheme();
  const { getByTestId } = render(
    <SplitButton label="Send" onPress={() => {}} onTrailingPress={() => {}} />
  );

  fireEvent(getByTestId('split-button-leading'), 'onPressIn');

  expect(getByTestId('split-button-leading-container')).toHaveStyle({
    borderTopEndRadius: theme.shapes.corner.medium,
    borderBottomEndRadius: theme.shapes.corner.medium,
  });
  expect(getByTestId('split-button-trailing-container')).toHaveStyle({
    borderTopStartRadius: theme.shapes.corner.extraSmall,
    borderBottomStartRadius: theme.shapes.corner.extraSmall,
  });

  fireEvent(getByTestId('split-button-leading'), 'onPressOut');
  fireEvent(getByTestId('split-button-trailing'), 'onPressIn');

  expect(getByTestId('split-button-trailing-container')).toHaveStyle({
    borderTopStartRadius: theme.shapes.corner.medium,
    borderBottomStartRadius: theme.shapes.corner.medium,
  });
});

it('marks both press targets disabled when disabled', () => {
  const { getByTestId } = render(
    <SplitButton
      label="Send"
      disabled
      onPress={() => {}}
      onTrailingPress={() => {}}
    />
  );

  expect(getByTestId('split-button-leading').props.accessibilityState).toEqual({
    disabled: true,
  });
  expect(getByTestId('split-button-trailing').props.accessibilityState).toEqual(
    {
      disabled: true,
    }
  );
});

it('passes custom styles to the correct target', () => {
  const { getByTestId } = render(
    <SplitButton
      label="Send"
      onPress={() => {}}
      onTrailingPress={() => {}}
      leadingButtonStyle={styles.leading}
      trailingButtonStyle={styles.trailing}
      labelStyle={styles.label}
    />
  );

  expect(getByTestId('split-button-leading-container')).toHaveStyle(
    styles.leading
  );
  expect(getByTestId('split-button-trailing-container')).toHaveStyle(
    styles.trailing
  );
  expect(getByTestId('split-button-label')).toHaveStyle(styles.label);
});

it('merges trailing accessibility state with expanded state', () => {
  const { getByTestId } = render(
    <SplitButton
      label="Send"
      onPress={() => {}}
      onTrailingPress={() => {}}
      trailingAccessibilityState={{ expanded: true }}
    />
  );

  expect(
    getByTestId('split-button-trailing').props.accessibilityState
  ).toMatchObject({
    expanded: true,
  });
});

describe('SplitButton utils', () => {
  it('normalizes supported MD3 modes', () => {
    expect(normalizeSplitButtonMode('filled')).toBe('filled');
    expect(normalizeSplitButtonMode('tonal')).toBe('tonal');
    expect(normalizeSplitButtonMode('outlined')).toBe('outlined');
  });

  it('resolves MD3 color roles for modes', () => {
    const theme = getTheme();

    expect(getSplitButtonColors({ theme, mode: 'filled' }).containerColor).toBe(
      theme.colors.primary
    );
    expect(getSplitButtonColors({ theme, mode: 'tonal' }).contentColor).toBe(
      theme.colors.onSecondaryContainer
    );
    expect(getSplitButtonColors({ theme, mode: 'elevated' }).contentColor).toBe(
      theme.colors.primary
    );
    expect(getSplitButtonColors({ theme, mode: 'outlined' }).borderColor).toBe(
      theme.colors.outline
    );
  });

  it('resolves per-size tokens against theme shape values', () => {
    const theme = getTheme();
    const sizeStyle = getSplitButtonSizeStyle({ theme, size: 'large' });

    expect(sizeStyle.containerHeight).toBe(96);
    expect(sizeStyle.trailingIconSize).toBe(38);
    expect(sizeStyle.innerRadius).toBe(theme.shapes.corner.small);
    expect(sizeStyle.innerPressedRadius).toBe(
      theme.shapes.corner.largeIncreased
    );
  });

  it('uses logical leading and trailing shapes', () => {
    expect(
      getSplitButtonLeadingShape({ containerRadius: 20, innerRadius: 4 })
    ).toEqual({
      borderTopStartRadius: 20,
      borderBottomStartRadius: 20,
      borderTopEndRadius: 4,
      borderBottomEndRadius: 4,
    });
    expect(
      getSplitButtonTrailingShape({ containerRadius: 20, innerRadius: 4 })
    ).toEqual({
      borderTopStartRadius: 4,
      borderBottomStartRadius: 4,
      borderTopEndRadius: 20,
      borderBottomEndRadius: 20,
    });
  });

  it('expands small visual sizes to a 48dp touch target', () => {
    expect(getSplitButtonHitSlop({ size: 'extra-small' })).toEqual({
      top: 8,
      bottom: 8,
    });
    expect(getSplitButtonHitSlop({ size: 'small' })).toEqual({
      top: 4,
      bottom: 4,
    });
    expect(getSplitButtonHitSlop({ size: 'medium' })).toBeUndefined();
  });
});
