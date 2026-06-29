import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

import { DEFAULT_SIZE, resolveAvatarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../types';
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
   * Custom color for the text.
   */
  color?: string;
  /**
   * Style for text container
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
      >
        {label}
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
