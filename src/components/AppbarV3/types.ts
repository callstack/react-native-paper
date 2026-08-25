import * as React from 'react';
import type {
  Animated,
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type { ThemeProp } from '../../types';
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
  | 'accessibilityActions'
  | 'accessibilityHint'
  | 'accessibilityLabel'
  | 'accessibilityLabelledBy'
  | 'accessibilityLanguage'
  | 'accessibilityState'
  | 'accessibilityValue'
  | 'aria-busy'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-selected'
  | 'onAccessibilityAction'
> & {
  /** Whether the headline interaction is disabled. */
  disabled?: boolean;
};

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

type AppbarWrittenHeadline = {
  /** Written headline displayed by the app bar. */
  headline: string;
  /** Optional supporting text displayed below the headline. */
  subtitle?: string;
  /** Props applied to the headline heading. */
  headlineProps?: AppbarHeadlineTextProps;
  /** Props applied to the subtitle text. */
  subtitleProps?: AppbarTextProps;
};

type AppbarHeadlineImage = {
  /** Image or logo displayed in the app bar. It should fit within 32dp height. */
  headlineImage: React.ReactElement;
};

type AppbarTextHeadline = AppbarWrittenHeadline & {
  variant: AppbarHeadlineVariant;
  headlineImage?: never;
};

type AppbarSmallImageHeadline = AppbarHeadlineImage & {
  variant: 'small';
  /** Accessible page headline. The image replaces this text visually. */
  headline: string;
  subtitle?: never;
  headlineProps?: never;
  subtitleProps?: never;
};

type AppbarFlexibleImageHeadline = AppbarWrittenHeadline &
  AppbarHeadlineImage & {
    variant: Exclude<AppbarHeadlineVariant, 'small'>;
  };

type AppbarBaseProps = Omit<
  ViewProps,
  | 'accessibilityLabel'
  | 'accessibilityRole'
  | 'accessible'
  | 'aria-label'
  | 'children'
  | 'role'
  | 'style'
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
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.Ref<View>;
  theme?: ThemeProp;
};

type AppbarHeadlineProps = {
  /** Headline and subtitle alignment. */
  headlineAlignment?: AppbarHeadlineAlignment;
  /** Trailing actions. */
  trailingActions?: AppbarTrailingActions;
  /** Style applied to the headline and subtitle area. */
  contentStyle?: StyleProp<ViewStyle>;
  searchBar?: never;
} & (
  | {
      /** Called when the headline area is pressed. */
      onHeadlinePress: (event: GestureResponderEvent) => void;
      /** Props applied to the interactive headline area. */
      headlinePressableProps?: AppbarHeadlinePressableProps;
    }
  | {
      onHeadlinePress?: never;
      headlinePressableProps?: never;
    }
);

export type AppbarSearchbarProps = Omit<
  SearchbarProps,
  'elevation' | 'mode' | 'showDivider' | 'theme'
> & {
  /** Search hint. Material guidance recommends including the word “Search”. */
  placeholder: string;
};

type AppbarSearchProps = {
  variant: 'search';
  /** Props forwarded to the existing Paper Searchbar. */
  searchBar: AppbarSearchbarProps;
  /** Exterior trailing actions. */
  trailingActions?: readonly AppbarStandardTrailingAction[];
  headline?: never;
  subtitle?: never;
  headlineImage?: never;
  headlineAlignment?: never;
  headlineProps?: never;
  subtitleProps?: never;
  onHeadlinePress?: never;
  headlinePressableProps?: never;
  contentStyle?: never;
};

export type Props = AppbarBaseProps &
  (
    | (AppbarHeadlineProps &
        (
          | AppbarTextHeadline
          | AppbarSmallImageHeadline
          | AppbarFlexibleImageHeadline
        ))
    | AppbarSearchProps
  );
