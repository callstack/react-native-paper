import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  Pressable,
  View,
  ViewStyle,
  ViewProps,
} from 'react-native';

import { modeTextVariant } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, TypescaleKey, ThemeProp } from '../../types';
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
  const {
    colors: { onSurface },
    fonts,
  } = useInternalTheme(themeOverrides);

  const titleTextColor = titleColor ? titleColor : onSurface;

  const modeContainerStyles = {
    small: styles.defaultContainer,
    medium: styles.mediumContainer,
    large: styles.largeContainer,
    'center-aligned': styles.defaultContainer,
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
  defaultContainer: {
    paddingHorizontal: 0,
  },
  mediumContainer: {
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  largeContainer: {
    paddingHorizontal: 0,
    paddingTop: 36,
    justifyContent: 'flex-end',
    paddingBottom: 28,
  },
});

export default AppbarContent;

// @component-docs ignore-next-line
export { AppbarContent };
