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

export type AppbarTitleVariant = Exclude<AppbarVariant, 'search'>;

export type AppbarTitleAlignment = 'leading' | 'center';

export type AppbarTextProps = {
  /** Style applied to the text. */
  style?: StyleProp<TextStyle>;
  /** Specifies the largest possible scale the font can reach. */
  maxFontSizeMultiplier?: number;
};

export type AppbarTitleTextProps = AppbarTextProps & {
  /** Reference for the title heading. */
  ref?: React.RefObject<TextRef | null>;
};

type AppbarActionBase = Omit<
  IconButtonProps,
  'icon' | 'iconColor' | 'mode' | 'selected' | 'size' | 'theme' | 'aria-label'
> & {
  /** Stable key used when rendering an action from the actions array. */
  key?: React.Key;
  /** Icon displayed by the action. */
  icon: IconSource;
  /** Accessible label announced for the icon button. */
  'aria-label': string;
  /** Custom action icon color. */
  color?: ColorValue;
};

export type AppbarStandardAction = AppbarActionBase & {
  variant?: 'standard';
  width?: never;
};

export type AppbarFilledAction = AppbarActionBase & {
  /** Filled primary and tonal actions use the corresponding IconButton colors. */
  variant: 'filled' | 'tonal';
  /** Expressive filled actions can use the default or wide container. */
  width?: 'default' | 'wide';
};

export type AppbarAction = AppbarStandardAction | AppbarFilledAction;

/** A filled action replaces the standard action group and is valid on its own. */
export type AppbarActions =
  | readonly AppbarStandardAction[]
  | readonly [AppbarFilledAction];

type AppbarLeadingIconAction = AppbarStandardAction & {
  type?: 'icon';
};

type AppbarBackAction = Omit<
  AppbarStandardAction,
  'aria-label' | 'icon' | 'type'
> & {
  /** Uses the platform-aware Paper back icon. */
  type: 'back';
  icon?: never;
  'aria-label'?: string;
};

export type AppbarLeadingAction = AppbarLeadingIconAction | AppbarBackAction;

type AppbarWrittenTitle = {
  /** Written headline displayed by the app bar. */
  title: string;
  /** Optional supporting text displayed below the headline. */
  subtitle?: string;
  /** Props applied to the title heading. */
  titleProps?: AppbarTitleTextProps;
  /** Props applied to the subtitle text. */
  subtitleProps?: AppbarTextProps;
};

type AppbarTitleImage = {
  /** Image or logo displayed in the app bar. It should fit within 32dp height. */
  titleImage: React.ReactElement;
};

type AppbarTextTitle = AppbarWrittenTitle & {
  variant: AppbarTitleVariant;
  titleImage?: never;
};

type AppbarSmallImageTitle = AppbarTitleImage & {
  variant: 'small';
  /** Accessible page title. The image replaces this text visually. */
  title: string;
  subtitle?: never;
  titleProps?: never;
  subtitleProps?: never;
};

type AppbarFlexibleImageTitle = AppbarWrittenTitle &
  AppbarTitleImage & {
    variant: Exclude<AppbarTitleVariant, 'small'>;
  };

type AppbarBaseProps = Omit<ViewProps, 'children' | 'style'> & {
  /** Optional leading navigation action. */
  leadingAction?: AppbarLeadingAction;
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

type AppbarTitleProps = {
  /** Headline and subtitle alignment. */
  titleAlignment?: AppbarTitleAlignment;
  /** Trailing icon actions. */
  actions?: AppbarActions;
  /** Called when the title area is pressed. */
  onTitlePress?: (event: GestureResponderEvent) => void;
  /** Style applied to the title area. */
  contentStyle?: StyleProp<ViewStyle>;
  searchBar?: never;
};

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
  /** Exterior trailing icon actions. */
  actions?: readonly AppbarStandardAction[];
  title?: never;
  subtitle?: never;
  titleImage?: never;
  titleAlignment?: never;
  titleProps?: never;
  subtitleProps?: never;
  onTitlePress?: never;
  contentStyle?: never;
};

export type Props = AppbarBaseProps &
  (
    | (AppbarTitleProps &
        (AppbarTextTitle | AppbarSmallImageTitle | AppbarFlexibleImageTitle))
    | AppbarSearchProps
  );
