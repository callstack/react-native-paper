import * as React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';

import { withInternalTheme } from '../../core/theming';
import { white } from '../../styles/themes/v2/colors';
import type {
  $RemoveChildren,
  InternalTheme,
  MD3TypescaleKey,
} from '../../types';
import Text from '../Typography/Text';
import { modeTextVariant } from './utils';

export type Props = $RemoveChildren<typeof View> & {
  /**
   * Custom color for the text.
   */
  color?: string;
  /**
   * Text for the title.
   */
  title: React.ReactNode;
  /**
   * Style for the title.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Reference for the title.
   */
  titleRef?: React.RefObject<Text>;
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
  onPress?: () => void;
  /**
   * @internal
   */
  mode?: 'small' | 'medium' | 'large' | 'center-aligned';
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

/**
 * A component used to display a title and optional subtitle in an appbar.
 *
 * <div class="screenshots">
 *   <img class="small" src="screenshots/appbar-content.png" />
 * </div>
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
  style,
  titleRef,
  titleStyle,
  theme,
  title,
  mode = 'small',
  ...rest
}: Props) => {
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

  return (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        pointerEvents="box-none"
        style={[styles.container, isV3 && modeContainerStyles[mode], style]}
        {...rest}
      >
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
          // @ts-ignore Type '"heading"' is not assignable to type ...
          accessibilityRole={Platform.OS === 'web' ? 'heading' : 'header'}
        >
          {title}
        </Text>
        {!isV3 && subtitle ? (
          <Text
            style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
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

export default withInternalTheme(AppbarContent);

// @component-docs ignore-next-line
const AppbarContentWithTheme = withInternalTheme(AppbarContent);
// @component-docs ignore-next-line
export { AppbarContentWithTheme as AppbarContent };
