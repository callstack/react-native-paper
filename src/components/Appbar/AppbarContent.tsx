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

import Text from '../Typography/Text';

import { withTheme } from '../../core/theming';
import { white } from '../../styles/themes/v2/colors';

import type { $RemoveChildren, Theme } from '../../types';
import { AppbarModes, modeTextVariant } from './utils';

type Props = $RemoveChildren<typeof View> & {
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
   * @deprecated
   * Text for the subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * @deprecated
   * Style for the subtitle.
   */
  subtitleStyle?: StyleProp<TextStyle>;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * `Available in v3.x`
   *
   * Mode of the Appbar.
   * - `small` - Appbar with default height (56).
   * - `medium` - Appbar with medium height (112).
   * - `large` - Appbar with large height (152).
   * - `center-aligned` - Appbar with default height and center-aligned title.
   */
  mode?: AppbarModes;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * A component used to display a title and optional subtitle in an appbar.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-content.png" />
 *   </figure>
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
  const { fonts, isV3, md } = theme;

  const subtitleColor = color(titleColor).alpha(0.7).rgb().string();

  const titleTextColor = titleColor
    ? titleColor
    : isV3
    ? (md('md.sys.color.on-surface') as string)
    : white;

  const modeContainerStyles = {
    small: styles.v3DefaultContainer,
    medium: styles.v3MediumContainer,
    large: styles.v3LargeContainer,
    'center-aligned': styles.v3DefaultContainer,
  };

  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
      <View
        style={[styles.container, isV3 && modeContainerStyles[mode], style]}
        {...rest}
      >
        <Text
          {...(isV3 && { variant: modeTextVariant[mode] })}
          ref={titleRef}
          style={[
            {
              color: titleTextColor,
              ...(!isV3 &&
                (Platform.OS === 'ios' ? fonts.regular : fonts.medium)),
            },
            !isV3 && styles.title,
            titleStyle,
          ]}
          numberOfLines={1}
          accessible
          accessibilityTraits="header"
          // @ts-expect-error React Native doesn't accept 'heading' as it's web-only
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

export default withTheme(AppbarContent);

// @component-docs ignore-next-line
const AppbarContentWithTheme = withTheme(AppbarContent);
// @component-docs ignore-next-line
export { AppbarContentWithTheme as AppbarContent };
