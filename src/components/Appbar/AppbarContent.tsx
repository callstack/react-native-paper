import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
  ViewProps,
} from 'react-native';

import { useAppbarContext } from './AppbarContext';
import { modeTextVariant } from './utils';
import { useInternalTheme } from '../../core/theming';
import { white } from '../../theme/colors';
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
  mode: modeOverride,
  theme: themeOverrides,
  testID = 'appbar-content',
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors, fonts } = theme as Theme;
  const { isDark = false, mode: contextMode } = useAppbarContext() ?? {};
  const mode = modeOverride ?? contextMode ?? 'small';

  const titleTextColor = titleColor
    ? titleColor
    : isDark
      ? white
      : colors.onSurface;

  const modeContainerStyles = {
    small: styles.v3DefaultContainer,
    medium: styles.v3MediumContainer,
    large: styles.v3LargeContainer,
    'center-aligned': styles.v3CenterAlignedContainer,
  };

  const variant = modeTextVariant[mode] as TypescaleKey;

  const contentWrapperProps = {
    pointerEvents: 'box-none' as ViewProps['pointerEvents'],
    style: [styles.container, modeContainerStyles[mode], style],
    testID,
    ...rest,
  };

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
          numberOfLines={1}
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
    marginLeft: 12,
  },
  v3CenterAlignedContainer: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  v3MediumContainer: {
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    marginLeft: 12,
  },
  v3LargeContainer: {
    paddingHorizontal: 0,
    paddingTop: 36,
    justifyContent: 'flex-end',
    paddingBottom: 28,
    marginLeft: 12,
  },
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
