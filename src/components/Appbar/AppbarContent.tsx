import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
  ViewProps,
} from 'react-native';

import { useAppbarContext, useAppbarTheme } from './AppbarContext';
import {
  APPBAR_CONTROLS_HEIGHT,
  APPBAR_HORIZONTAL_PADDING,
  flexibleModeHeightWithSubtitle,
  flexibleModeSubtitleVariant,
  getAppbarColor,
  isFlexibleMode,
  modeTextVariant,
} from './utils';
import type { ThemeProp } from '../../theme/types';
import { mergeDataSetProps, useFocusRing } from '../../utils/useFocusRing';
import Text from '../Typography/Text';
import type { TextRef } from '../Typography/Text';

type TitleString = {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
};

type TitleElement = { title: React.ReactNode; titleStyle?: never };

export type Props = Omit<React.PropsWithoutRef<ViewProps>, 'children'> & {
  // For `title` and `titleStyle` props their types are duplicated due to the generation of documentation.
  // Appropriate type for them are either `TitleString` or `TitleElement`, depends on `title` type.
  /**
   * Text or component for the title.
   */
  title: React.ReactNode;
  /**
   * Style for the title, if `title` is a string.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Reference for the title.
   */
  titleRef?: React.RefObject<TextRef>;
  /**
   * @supported Available in v6.x
   *
   * Text or component for the subtitle, shown below the title in the `medium-flexible` and `large-flexible` modes.
   * The other modes don't show it. A subtitle raises the minimum height of the Appbar to `136` in the `medium-flexible` mode and to `152` in the `large-flexible` mode.
   */
  subtitle?: React.ReactNode;
  /**
   * @supported Available in v6.x
   *
   * Style for the subtitle, if `subtitle` is a string.
   */
  subtitleStyle?: StyleProp<TextStyle>;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * If true, disable all interactions for this component.
   */
  disabled?: boolean;
  /**
   * Custom color for the title and the subtitle.
   */
  color?: string;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * @supported Available in v6.x
   *
   * Specifies the largest possible scale a subtitle font can reach.
   */
  subtitleMaxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
} & (TitleString | TitleElement);

/**
 * A component used to display a title in an appbar.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar.Header>
 *      <Appbar.Content title="Title" />
 *   </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * ### With a subtitle
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar.Header mode="medium-flexible">
 *      <Appbar.Content title="Inbox" subtitle="3 unread messages" />
 *   </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
const AppbarContent = ({
  color: titleColor,
  onPress,
  disabled,
  style,
  titleRef,
  titleStyle,
  title,
  titleMaxFontSizeMultiplier,
  subtitle,
  subtitleStyle,
  subtitleMaxFontSizeMultiplier,
  theme: themeOverrides,
  testID,
  onLayout,
  ...rest
}: Props) => {
  const appbar = useAppbarContext();
  const theme = useAppbarTheme(themeOverrides);
  const { colors, fonts } = theme;

  // With `onPress` the title is a button, so it gets the keyboard focus ring
  // (MD3: interactive elements in an app bar have focus rings). It is a plain
  // `Pressable`, so it calls the hook directly. Outward, the default.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    disabled || !onPress,
    colors.secondary
  );

  const mode = appbar?.mode ?? 'small';
  const insets = appbar?.insets;
  const onContentLayout = appbar?.onContentLayout;
  const contentMargins = appbar?.contentMargins;
  const isFlexible = isFlexibleMode(mode);

  // The cleanup of the effect runs when the content unmounts, and when the
  // callback changes, so the Appbar forgets the layout of a content that is gone
  React.useEffect(() => () => onContentLayout?.(null), [onContentLayout]);

  const customTextColor = getAppbarColor({
    color: titleColor,
    isDark: appbar?.dark ?? false,
  });
  const titleTextColor = customTextColor ?? colors.onSurface;

  // Only the flexible modes show the subtitle. The Appbar grows with the content,
  // so the content takes up the space that the subtitle adds to the minimum height.
  const subtitleLayout =
    isFlexibleMode(mode) && subtitle
      ? {
          variant: flexibleModeSubtitleVariant[mode],
          minHeight:
            flexibleModeHeightWithSubtitle[mode] - APPBAR_CONTROLS_HEIGHT,
        }
      : null;

  // The `medium` and `large` modes show the title below the actions, and the flexible modes
  // grow with the title, so the title is positioned at the bottom of the Appbar
  // and the content only takes up the space between the actions.
  const isBottomAligned = mode === 'medium' || mode === 'large' || isFlexible;

  const bottomStyle = [
    styles.bottom,
    {
      left: (insets?.left ?? 0) + APPBAR_HORIZONTAL_PADDING + 12,
      right: (insets?.right ?? 0) + APPBAR_HORIZONTAL_PADDING + 12,
      bottom: insets?.bottom ?? 0,
    },
    mode === 'medium' && styles.mediumBottom,
    mode === 'large' && styles.largeBottom,
    isFlexible && styles.flexibleBottom,
    subtitleLayout && { minHeight: subtitleLayout.minHeight },
  ];

  const variant = modeTextVariant[mode];

  const contentWrapperProps = {
    pointerEvents: 'box-none',
    style: [
      isBottomAligned
        ? bottomStyle
        : mode === 'center-aligned'
          ? [
              styles.centerAligned,
              contentMargins && {
                marginLeft: contentMargins.left,
                marginRight: contentMargins.right,
              },
            ]
          : styles.container,
      style,
    ],
    testID,
    ...rest,
    // The Appbar grows with the title, or centers it, based on its layout. The
    // handler is always set, as on the web it is only called if it is set when the content mounts.
    onLayout: (event: LayoutChangeEvent) => {
      onContentLayout?.(event.nativeEvent.layout);
      onLayout?.(event);
    },
  } satisfies ViewProps;

  const content = (
    <>
      {typeof title === 'string' ? (
        <Text
          variant={variant}
          ref={titleRef}
          style={[
            {
              color: titleTextColor,
              ...fonts[variant],
            },
            titleStyle,
          ]}
          numberOfLines={isFlexible ? 2 : 1}
          accessible
          role={onPress ? 'none' : 'heading'}
          maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
        >
          {title}
        </Text>
      ) : (
        title
      )}
      {subtitleLayout ? (
        typeof subtitle === 'string' ? (
          <Text
            variant={subtitleLayout.variant}
            style={[
              {
                color: customTextColor ?? colors.onSurfaceVariant,
                ...fonts[subtitleLayout.variant],
              },
              subtitleStyle,
            ]}
            numberOfLines={1}
            maxFontSizeMultiplier={subtitleMaxFontSizeMultiplier}
          >
            {subtitle}
          </Text>
        ) : (
          subtitle
        )
      ) : null}
    </>
  );

  const wrapper = onPress ? (
    <Pressable
      role="button"
      aria-disabled={disabled}
      onPress={onPress}
      disabled={disabled}
      {...contentWrapperProps}
      // Like Switch: a ripple drawable owns the focused state, so Android does
      // not add its grey default focus highlight on top of the ring.
      android_ripple={{ color: 'transparent' }}
      onFocus={(e) => {
        focusTarget.onFocus?.(e);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        focusTarget.onBlur?.();
        rest.onBlur?.(e);
      }}
      {...mergeDataSetProps(rest, focusRing.dataSetProps)}
      style={[...contentWrapperProps.style, ...focusRing.style]}
    >
      {content}
    </Pressable>
  ) : (
    <View {...contentWrapperProps}>{content}</View>
  );

  if (isBottomAligned) {
    return (
      <>
        {/* Takes up the space between the actions, so the trailing actions stay at the end */}
        <View style={styles.spacer} />
        {wrapper}
      </>
    );
  }

  return wrapper;
};

AppbarContent.displayName = 'Appbar.Content';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 12,
  },
  centerAligned: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  bottom: {
    position: 'absolute',
  },
  mediumBottom: {
    paddingBottom: 24,
  },
  largeBottom: {
    paddingBottom: 28,
  },
  flexibleBottom: {
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
