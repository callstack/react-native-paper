import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

import { DEFAULT_SIZE, resolveAvatarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../types';
import { takeGraphemes } from '../../utils/takeGraphemes';
import Text from '../Typography/Text';

export type Props = ViewProps & {
  /**
   * Initials to show as the text in the `Avatar`.
   */
  label: string;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Custom color for the text. Takes precedence over the automatic contrast
   * color below.
   */
  color?: string;
  /**
   * Style for text container. A custom `backgroundColor` is automatically
   * paired with a contrasting text color when `color` is not set: string
   * values use a luminance heuristic, while opaque/dynamic values
   * (`PlatformColor` / `DynamicColorIOS`) are paired with a theme role's
   * `on-` color, falling back to `onSurface`.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the title.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Avatars can be used to represent people in a graphical way.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Avatar.Text size={24} label="XD" />
 * );
 * ```
 */
const AvatarText = ({
  label,
  size = DEFAULT_SIZE,
  style,
  labelStyle,
  color: customColor,
  theme: themeOverrides,
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { backgroundColor, ...restStyle } = StyleSheet.flatten(style) || {};
  const { background, textColor } = resolveAvatarColors({
    theme,
    backgroundColor,
    color: customColor,
  });
  const { fontScale } = useWindowDimensions();
  const avatarInitials = takeGraphemes(label, 2);
  const hasCustomLabel =
    rest.accessibilityLabel !== undefined || rest['aria-label'] !== undefined;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
          backgroundColor: background,
        },
        styles.container,
        restStyle,
      ]}
      accessible
      {...(!hasCustomLabel && { 'aria-label': label })}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          theme.fonts.titleMedium,
          {
            color: textColor,
            fontSize: size / 2,
            lineHeight: size / fontScale,
          },
          labelStyle,
        ]}
        numberOfLines={1}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        aria-hidden
      >
        {avatarInitials}
      </Text>
    </View>
  );
};

AvatarText.displayName = 'Avatar.Text';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default AvatarText;
