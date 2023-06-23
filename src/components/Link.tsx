import * as React from 'react';
import {
  Linking,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import Text from './Typography/Text';
import type { VariantProp } from './Typography/types';

const URLRegex = /^(?:http:\/\/|www\.|https:\/\/)([^/]+)/;

type Props<T> = React.ComponentProps<typeof Pressable> & {
  /**
   * URL to open
   */
  href: string;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Variant defines appropriate text styles for size.
   * Available variants:
   *
   *  Display: `displayLarge`, `displayMedium`, `displaySmall`
   *
   *  Headline: `headlineLarge`, `headlineMedium`, `headlineSmall`
   *
   *  Title: `titleLarge`, `titleMedium`, `titleSmall`
   *
   *  Label:  `labelLarge`, `labelMedium`, `labelSmall`
   *
   *  Body: `bodyLarge`, `bodyMedium`, `bodySmall`
   */
  size?: VariantProp<T>;
  /**
   * Content of the `Linking`.
   */
  children: string;
  /**
   * where to position the link in the view.
   */
  position?: string;
  /**
   * add a underline on the link
   */
  underline?: boolean;
  /**
   * @optional
   */
  style?: StyleProp<ViewStyle>;
};

/**
 * Link is a simple component where users can use to open external link.
 * `http://` and `https://` protocols are supported.
 * Note: Only valid https and http link are show.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Link } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *
 *   return (
 *     <Link
 *       href="https://callstack.github.io/react-native-paper/"
 *     >
 *     React native paper
 *     </Link>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Link = ({
  href,
  size = 'bodyMedium',
  children,
  position = 'left',
  underline = false,
  style,
}: Props<never>) => {
  const linkStyle = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const textStyle = underline && styles.underline;

  const openLink = async () => {
    try {
      await Linking.openURL(href);
    } catch (error) {
      console.error(error);
    }
  };

  return URLRegex.test(href) ? (
    <Pressable
      onPress={openLink}
      style={[
        styles.container,
        position === 'center'
          ? styles.center
          : position === 'right'
          ? styles.right
          : styles.left,
      ]}
    >
      <Text variant={size} style={[textStyle, linkStyle]}>
        {children}
      </Text>
    </Pressable>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
  center: {
    alignSelf: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

export default Link;
