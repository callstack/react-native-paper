import * as React from 'react';
import type {
  ColorValue,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type { AnimatedStyle } from 'react-native-reanimated';

import type { ThemeProp } from '../../theme/types';
import type { IconSource } from '../Icon';
import type { Props as IconButtonProps } from '../IconButton/IconButton';
import type { Props as SearchbarProps } from '../Searchbar';
import type { TextRef } from '../Typography/Text';

export type AppbarVariant =
  | 'search'
  | 'small'
  | 'medium-flexible'
  | 'large-flexible';

export type AppbarHeadlineVariant = Exclude<AppbarVariant, 'search'>;

export type AppbarHeadlineAlignment = 'leading' | 'center';

export type AppbarTextProps = {
  /** Style applied to the text. */
  style?: StyleProp<TextStyle>;
  /** Specifies the largest possible scale the font can reach. */
  maxFontSizeMultiplier?: number;
};

export type AppbarHeadlineTextProps = AppbarTextProps & {
  /** Reference for the headline heading. */
  ref?: React.RefObject<TextRef | null>;
};

export type AppbarHeadlinePressableProps = Pick<
  ViewProps,
  | 'accessibilityHint'
  | 'accessibilityLabel'
  | 'accessibilityState'
  | 'aria-busy'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-selected'
> & {
  /** Whether the headline interaction is disabled. */
  disabled?: boolean;
};

/** Decorates the resolved icon button without replacing its action configuration. */
export type AppbarActionDecorator = (
  button: React.ReactElement<IconButtonProps>
) => React.ReactElement;

type AppbarTrailingActionBase = Omit<
  IconButtonProps,
  'icon' | 'iconColor' | 'mode' | 'selected' | 'size' | 'theme' | 'aria-label'
> & {
  /** Stable key used when rendering an action from the trailing actions array. */
  key: React.Key;
  /** Icon displayed by the trailing action. */
  icon: IconSource;
  /** Accessible label announced for the icon button. */
  'aria-label': string;
  /** Custom trailing action icon color. */
  color?: ColorValue;
  /** Wraps the resolved icon button, for example with a Tooltip or Menu. */
  decorate?: AppbarActionDecorator;
};

export type AppbarStandardTrailingAction = AppbarTrailingActionBase & {
  variant?: 'standard';
  width?: never;
};

export type AppbarFilledTrailingAction = AppbarTrailingActionBase & {
  /** Filled primary and tonal icons use the corresponding IconButton colors. */
  variant: 'filled' | 'tonal';
  /** Expressive filled icons can use the default or wide container. */
  width?: 'default' | 'wide';
};

export type AppbarTrailingAction =
  | AppbarStandardTrailingAction
  | AppbarFilledTrailingAction;

/** A filled trailing action replaces the standard action group and is valid on its own. */
export type AppbarTrailingActions =
  | readonly AppbarStandardTrailingAction[]
  | readonly [AppbarFilledTrailingAction];

type AppbarLeadingIconButton = Omit<AppbarStandardTrailingAction, 'key'> & {
  key?: never;
  type?: 'icon';
};

type AppbarBackButton = Omit<
  AppbarStandardTrailingAction,
  'aria-label' | 'icon' | 'key' | 'type'
> & {
  /** Uses the platform-aware Paper back icon. */
  type: 'back';
  icon?: never;
  key?: never;
  'aria-label'?: string;
};

export type AppbarLeadingButton = AppbarLeadingIconButton | AppbarBackButton;

export type AppbarBaseProps = Omit<
  ViewProps,
  'accessibilityLabel' | 'accessibilityRole' | 'children' | 'style' | 'testID'
> & {
  /** Optional leading button. */
  leadingButton?: AppbarLeadingButton;
  /** Uses the on-scroll container color when true. */
  isScrolled?: boolean;
  /** Override for the automatic top safe-area inset. */
  statusBarHeight?: number;
  /** Safe-area inset overrides. Unspecified values use the detected insets. */
  safeAreaInsets?: {
    top?: number;
    left?: number;
    right?: number;
  };
  /** Style applied to the app bar container. */
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  /** Reference for the app bar container. */
  ref?: React.Ref<View>;
  /** Theme override for the app bar. */
  theme?: ThemeProp;
  /** TestID used for testing purposes. */
  testID?: string;
};

export type AppbarSearchbarProps = Omit<
  SearchbarProps,
  'elevation' | 'mode' | 'showDivider' | 'theme'
> & {
  /** Search hint. Material guidance recommends including the word “Search”. */
  placeholder: string;
};

// `Props` is declared in `Appbar.tsx` (co-located with the `Appbar` component)
// so the docs-generation parser — which looks for a `Props` type-alias
// declaration in the same source file as the component it documents — can
// find it.
export type { Props as AppbarProps } from './Appbar';
