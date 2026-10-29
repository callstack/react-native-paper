import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

import { DEFAULT_SIZE } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../theme/types';
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
  const { fontScale } = useWindowDimensions();

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
          backgroundColor: theme.colors.primaryContainer,
        },
        styles.container,
        style,
      ]}
      {...rest}
    >
      <Text
        variant="titleMedium"
        theme={themeOverrides}
        style={[
          styles.text,
          {
            color: customColor ?? theme.colors.onPrimaryContainer,
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
