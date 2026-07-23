import * as React from 'react';
import {
  Image,
  StyleSheet,
  Pressable,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
  ViewProps,
} from 'react-native';
// ViewStyle used for mode container map

import { AppbarTokens } from './tokens';
import type { TopAppBarMode } from './tokens';
import { modeTextVariant } from './utils';
import { useInternalTheme } from '../../core/theming';
import type {
  $RemoveChildren,
  Theme,
  TypescaleKey,
  ThemeProp,
} from '../../types';
import Text from '../Typography/Text';
import type { TextRef } from '../Typography/Text';

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
   * Optional subtitle (restored for MD3 flexible medium/large variants).
   */
  subtitle?: React.ReactNode;
  /**
   * Style for the subtitle when it is a string.
   */
  subtitleStyle?: StyleProp<TextStyle>;
  /**
   * Optional logo / image shown with flexible app bar content.
   */
  logo?: ImageSourcePropType | React.ReactNode;
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
  /**
   * @internal
   */
  mode?: TopAppBarMode;
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
 * Title (and optional subtitle / logo) content for a top app bar.
 * Subtitle and logo are intended for medium-flexible and large-flexible modes.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TopAppBar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TopAppBar.Header mode="medium-flexible">
 *     <TopAppBar.Content title="Title" subtitle="Subtitle" />
 *   </TopAppBar.Header>
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
  subtitleStyle,
  logo,
  titleMaxFontSizeMultiplier,
  mode = 'small',
  theme: themeOverrides,
  testID = 'appbar-content',
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors, fonts } = theme as Theme;

  const titleTextColor = titleColor ? titleColor : colors.onSurface;
  const subtitleColor = colors.onSurfaceVariant;

  const modeContainerStyles: Record<string, ViewStyle> = {
    small: styles.v3DefaultContainer,
    medium: styles.v3MediumContainer,
    large: styles.v3LargeContainer,
    'center-aligned': styles.v3DefaultContainer,
    'medium-flexible': styles.v3MediumContainer,
    'large-flexible': styles.v3LargeContainer,
  };

  const variant = (modeTextVariant[mode] ??
    AppbarTokens.typography.small) as TypescaleKey;
  const subtitleVariant = AppbarTokens.typography.subtitle as TypescaleKey;
  const isFlexible =
    mode === 'medium-flexible' ||
    mode === 'large-flexible' ||
    mode === 'medium' ||
    mode === 'large';

  const contentWrapperProps = {
    pointerEvents: 'box-none' as ViewProps['pointerEvents'],
    style: [styles.container, modeContainerStyles[mode], style],
    testID,
    ...rest,
  };

  const logoNode =
    logo == null ? null : React.isValidElement(logo) ? (
      logo
    ) : (
      <Image
        source={logo as ImageSourcePropType}
        style={styles.logo}
        accessibilityIgnoresInvertColors
        testID={`${testID}-logo`}
      />
    );

  const content = (
    <View style={isFlexible ? styles.flexibleColumn : undefined}>
      {logoNode}
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
          testID={`${testID}-title-text`}
          maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
        >
          {title}
        </Text>
      ) : (
        title
      )}
      {subtitle != null && subtitle !== false && isFlexible ? (
        typeof subtitle === 'string' ? (
          <Text
            variant={subtitleVariant}
            style={[
              {
                color: subtitleColor,
                ...fonts[subtitleVariant],
              },
              subtitleStyle,
            ]}
            numberOfLines={1}
            testID={`${testID}-subtitle-text`}
          >
            {subtitle}
          </Text>
        ) : (
          subtitle
        )
      ) : null}
    </View>
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
  flexibleColumn: {
    justifyContent: 'flex-end',
  },
  logo: {
    width: AppbarTokens.sizes.logoSize,
    height: AppbarTokens.sizes.logoSize,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
