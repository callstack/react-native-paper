import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
  ViewProps,
} from 'react-native';

import { modeTextVariant } from './utils';
import type { AppbarModes } from './utils';
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
   * Optional subtitle or supporting text. Restored as part of the MD3 Expressive specification for flexible variants.
   */
  subtitle?: React.ReactNode;
  /**
   * Style for the subtitle, if `subtitle` is a string.
   */
  subtitleStyle?: StyleProp<TextStyle>;
  /**
   * Reference for the subtitle.
   */
  subtitleRef?: React.RefObject<TextRef>;
  /**
   * Optional logo or image component to render alongside title.
   */
  image?: React.ReactNode;
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
   * Specifies the largest possible scale a subtitle font can reach.
   */
  subtitleMaxFontSizeMultiplier?: number;
  /**
   * Number of lines to show for title before truncating.
   */
  titleNumberOfLines?: number;
  /**
   * Number of lines to show for subtitle before truncating.
   */
  subtitleNumberOfLines?: number;
  /**
   * Alignment of title and subtitle.
   */
  titleAlignment?: 'start' | 'center';
  /**
   * Whether the appbar is in collapsed state.
   */
  collapsed?: boolean;
  /**
   * Mode of the Appbar.
   */
  mode?: AppbarModes;
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
  subtitle,
  subtitleRef,
  subtitleStyle,
  image,
  titleMaxFontSizeMultiplier,
  subtitleMaxFontSizeMultiplier,
  titleNumberOfLines = 1,
  subtitleNumberOfLines = 1,
  titleAlignment,
  collapsed = false,
  mode = 'small',
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors, fonts } = theme;

  const titleTextColor = titleColor ? titleColor : colors.onSurface;
  const isCenterAligned =
    titleAlignment === 'center' || mode === 'center-aligned';

  const modeContainerStyles: Record<AppbarModes, StyleProp<ViewStyle>> = {
    small: styles.v3DefaultContainer,
    medium: styles.v3MediumContainer,
    large: styles.v3LargeContainer,
    'center-aligned': styles.v3DefaultContainer,
    'medium-flexible': styles.v3MediumFlexibleContainer,
    'large-flexible': styles.v3LargeFlexibleContainer,
  };

  const currentVariant = collapsed ? 'titleLarge' : modeTextVariant[mode];

  const contentWrapperProps = {
    pointerEvents: 'box-none',
    style: [
      styles.container,
      collapsed ? styles.v3DefaultContainer : modeContainerStyles[mode],
      ...(isCenterAligned ? [styles.centerAlignedContent] : []),
      style,
    ],
    testID,
    ...rest,
  } satisfies ViewProps;

  const titleElement =
    typeof title === 'string' ? (
      <Text
        variant={currentVariant}
        ref={titleRef}
        style={[
          {
            color: titleTextColor,
            ...fonts[currentVariant],
          },
          ...(isCenterAligned ? [styles.centerText] : []),
          titleStyle,
        ]}
        numberOfLines={titleNumberOfLines}
        accessible
        role={onPress ? 'none' : 'heading'}
        maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
      >
        {title}
      </Text>
    ) : (
      title
    );

  const subtitleElement =
    !collapsed && subtitle != null ? (
      typeof subtitle === 'string' ? (
        <Text
          variant="bodyMedium"
          ref={subtitleRef}
          style={[
            {
              color: colors.onSurfaceVariant,
              ...fonts.bodyMedium,
            },
            isCenterAligned && styles.centerText,
            styles.subtitleSpacing,
            subtitleStyle,
          ]}
          numberOfLines={subtitleNumberOfLines}
          accessible
          maxFontSizeMultiplier={subtitleMaxFontSizeMultiplier}
        >
          {subtitle}
        </Text>
      ) : (
        subtitle
      )
    ) : null;

  const content = (
    <>
      {image ? (
        <View
          style={[
            styles.imageWrapper,
            isCenterAligned && styles.centerAlignedImageWrapper,
          ]}
        >
          {image}
          <View
            style={[
              styles.textContainer,
              isCenterAligned && styles.centerAlignedContent,
            ]}
          >
            {titleElement}
            {subtitleElement}
          </View>
        </View>
      ) : (
        <>
          {titleElement}
          {subtitleElement}
        </>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        role="button"
        aria-disabled={disabled}
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
  v3MediumFlexibleContainer: {
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  v3LargeFlexibleContainer: {
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  centerAlignedContent: {
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  subtitleSpacing: {
    marginTop: 2,
  },
  imageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerAlignedImageWrapper: {
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
