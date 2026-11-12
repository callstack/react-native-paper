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

import { useAppbarContext, useAppbarItem } from './AppbarContext';
import {
  APPBAR_HORIZONTAL_PADDING,
  getAppbarColor,
  isFlexibleMode,
  modeTextVariant,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
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
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * If true, disable all interactions for this component.
   */
  disabled?: boolean;
  /**
   * Custom color for the text.
   */
  color?: string;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
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
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const appbar = useAppbarContext();
  const theme = useInternalTheme(themeOverrides ?? appbar?.theme);
  const { colors, fonts } = theme;

  useAppbarItem(appbar, 'content');

  const mode = appbar?.mode ?? 'small';
  const insets = appbar?.insets;
  const onContentLayout = appbar?.onContentLayout;
  const isFlexible = isFlexibleMode(mode);

  React.useEffect(() => () => onContentLayout?.(0), [onContentLayout]);

  const titleTextColor =
    getAppbarColor({ color: titleColor, isDark: appbar?.dark ?? false }) ??
    colors.onSurface;

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
  ];

  const variant = modeTextVariant[mode];

  const contentWrapperProps = {
    pointerEvents: 'box-none',
    style: [
      isBottomAligned
        ? bottomStyle
        : mode === 'center-aligned'
          ? styles.centerAligned
          : styles.container,
      style,
    ],
    testID,
    onLayout: isFlexible
      ? (event: LayoutChangeEvent) =>
          onContentLayout?.(event.nativeEvent.layout.height)
      : undefined,
    ...rest,
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
    </>
  );

  const wrapper = onPress ? (
    <Pressable
      role="button"
      aria-disabled={disabled}
      onPress={onPress}
      disabled={disabled}
      {...contentWrapperProps}
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
    paddingTop: 8,
    paddingBottom: 12,
  },
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
