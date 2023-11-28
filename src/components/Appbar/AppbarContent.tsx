import * as React from 'react';
import {
  AccessibilityRole,
  GestureResponderEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  Pressable,
  View,
  ViewStyle,
  ViewProps,
} from 'react-native';

import color from 'color';

import { modeTextVariant } from './utils';
import { useInternalTheme } from '../../core/theming';
import { white } from '../../styles/themes/v2/colors';
import type { $RemoveChildren, MD3TypescaleKey, ThemeProp } from '../../types';
import Text, { TextRef } from '../Typography/Text';

type TitleString = {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
};

type TitleElement = { title: React.ReactNode; titleStyle?: never };

export type Props = $RemoveChildren<typeof View> & {
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
   * @deprecated Deprecated in v5.x
   * Text for the subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * @deprecated Deprecated in v5.x
   * Style for the subtitle.
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
   * Custom color for the text.
   */
  color?: string;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * @internal
   */
  mode?: 'small' | 'medium' | 'large' | 'center-aligned';
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
 * A component used to display a title and optional subtitle in an appbar.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *     <Appbar.Header>
 *        <Appbar.Content title="Title" />
 *     </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
const AppbarContent = ({
  color: titleColor,
  subtitle,
  subtitleStyle,
  onPress,
  disabled,
  style,
  titleRef,
  titleStyle,
  title,
  titleMaxFontSizeMultiplier,
  mode = 'small',
  theme: themeOverrides,
  testID = 'appbar-content',
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { isV3, colors } = theme;

  const titleTextColor = titleColor
    ? titleColor
    : isV3
    ? colors.onSurface
    : white;

  const subtitleColor = color(titleTextColor).alpha(0.7).rgb().string();

  const modeContainerStyles = {
    small: styles.v3DefaultContainer,
    medium: styles.v3MediumContainer,
    large: styles.v3LargeContainer,
    'center-aligned': styles.v3DefaultContainer,
  };

  const variant = modeTextVariant[mode] as MD3TypescaleKey;

  const contentWrapperProps = {
    pointerEvents: 'box-none' as ViewProps['pointerEvents'],
    style: [styles.container, isV3 && modeContainerStyles[mode], style],
    testID,
    ...rest,
  };

  const content = (
    <>
      {typeof title === 'string' ? (
        <Text
          {...(isV3 && { variant })}
          ref={titleRef}
          style={[
            {
              color: titleTextColor,
              ...(isV3
                ? theme.fonts[variant]
                : Platform.OS === 'ios'
                ? theme.fonts.regular
                : theme.fonts.medium),
            },
            !isV3 && styles.title,
            titleStyle,
          ]}
          numberOfLines={1}
          accessible
          accessibilityRole={
            onPress
              ? 'none'
              : Platform.OS === 'web'
              ? ('heading' as 'header')
              : 'header'
          }
          // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
          accessibilityTraits="header"
          testID={`${testID}-title-text`}
          maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
        >
          {title}
        </Text>
      ) : (
        title
      )}
      {!isV3 && subtitle ? (
        <Text
          style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      // eslint-disable-next-line react-native-a11y/has-accessibility-props
      <Pressable
        accessibilityRole={touchableRole}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={touchableRole}
        accessibilityComponentType="button"
        onPress={onPress}
        disabled={disabled}
        {...contentWrapperProps}
      >
        {content}
      </Pressable>
    );
  }

  return <View {...contentWrapperProps}>{content}</View>;
};

AppbarContent.displayName = 'Appbar.Content';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  v3DefaultContainer: {
    paddingHorizontal: 0,
  },
  v3MediumContainer: {
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  v3LargeContainer: {
    paddingHorizontal: 0,
    paddingTop: 36,
    justifyContent: 'flex-end',
    paddingBottom: 28,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
  },
  subtitle: {
    fontSize: Platform.OS === 'ios' ? 11 : 14,
  },
});

const iosTouchableRole: readonly AccessibilityRole[] = ['button', 'header'];
const touchableRole: AccessibilityRole = Platform.select({
  ios: iosTouchableRole as unknown as 'button',
  default: iosTouchableRole[0],
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
