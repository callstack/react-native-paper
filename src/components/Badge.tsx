import * as React from 'react';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import { useInternalTheme } from '../core/theming';
import { cornerFull } from '../theme/tokens/sys/shape';
import type { ThemeProp } from '../types';

const SMALL_SIZE = 6;
const LARGE_SIZE = 16;
const MAX_LARGE_WIDTH = 34;
const LARGE_PADDING = 4;

export type Props = React.ComponentProps<typeof Animated.Text> & {
  /**
   * Whether the badge is visible
   */
  visible?: boolean;
  /**
   * Content of the `Badge`.
   */
  children?: string | number;
  style?: StyleProp<TextStyle>;
  ref?: React.RefObject<typeof Animated.Text>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * The bagde is styled differently based on whether `children` is passed:
 * - Small dot when it doesn't have `children` 
 * - Larger pill when it has `children`
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge>3</Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Badge = ({
  children,
  style,
  theme: themeOverrides,
  visible = true,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: opacity } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { fontScale } = useWindowDimensions();

  const isFirstRendering = React.useRef<boolean>(true);

  const {
    animation: { scale },
  } = theme;

  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      return;
    }

    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150 * scale,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity, scale]);

  const { backgroundColor = theme.colors.error, ...restStyle } =
    (StyleSheet.flatten(style) || {}) as TextStyle;

  const textColor = theme.colors.onError;

  const isLarge = children != null;
  const badgeSize = isLarge ? LARGE_SIZE : SMALL_SIZE;
  const labelFont = theme.fonts.labelSmall;

  return (
    <Animated.Text
      numberOfLines={1}
      style={[
        {
          opacity,
          backgroundColor,
          color: textColor,
          borderRadius: cornerFull,
          height: badgeSize,
          minWidth: badgeSize,
          ...(isLarge && {
            maxWidth: MAX_LARGE_WIDTH,
            paddingHorizontal: LARGE_PADDING,
            ...labelFont,
            lineHeight: LARGE_SIZE / fontScale,
          }),
        },
        styles.container,
        restStyle,
      ]}
      {...rest}
    >
      {children}
    </Animated.Text>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
});
