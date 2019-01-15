/* @flow */

import * as React from 'react';
import { Image, Text, StyleSheet, I18nManager } from 'react-native';
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';

let MaterialIcons;

try {
  // Optionally require vector-icons
  MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
} catch (e) {
  if (global.__expo && global.__expo.Icon && global.__expo.Icon.MaterialIcons) {
    // Snack doesn't properly bundle vector icons from subpath
    // Use icons from the __expo global if available
    MaterialIcons = global.__expo.Icon.MaterialIcons;
  } else {
    // Fallback component for icons
    MaterialIcons = ({ name, color, size, ...rest }) => {
      // eslint-disable-next-line no-console
      console.warn(
        `Tried to use the icon '${name}' in a component from 'react-native-paper', but 'react-native-vector-icons' is not installed. To remove this warning, install 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/icons.html.`
      );

      return (
        <Text
          {...rest}
          style={[styles.icon, { color, fontSize: size }]}
          pointerEvents="none"
        >
          □
        </Text>
      );
    };
  }
}

type IconSourceBase = string | ImageSource;

export type IconSource =
  | IconSourceBase
  | $ReadOnly<{ source: IconSourceBase, direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps) => React.Node);

type IconProps = {
  color: string,
  size: number,
};

type Props = IconProps & {
  source: IconSource,
};

const isImageSource = (source: any) =>
  // source is an object with uri
  (typeof source === 'object' &&
    source !== null &&
    (Object.prototype.hasOwnProperty.call(source, 'uri') &&
      typeof source.uri === 'string')) ||
  // source is a module, e.g. - require('image')
  typeof source === 'number';

const getIconId = (source: any) => {
  if (
    typeof source === 'object' &&
    source !== null &&
    (Object.prototype.hasOwnProperty.call(source, 'uri') &&
      typeof source.uri === 'string')
  ) {
    return source.uri;
  }

  return source;
};

export const isValidIcon = (source: any) =>
  typeof source === 'string' || isImageSource(source);

export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

const Icon = ({ source, color, size, ...rest }: Props) => {
  const direction =
    typeof source === 'object' && source.direction && source.source
      ? source.direction === 'auto'
        ? I18nManager.isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;
  const s =
    typeof source === 'object' && source.direction && source.source
      ? source.source
      : source;

  if (typeof s === 'string') {
    return (
      <MaterialIcons
        {...rest}
        name={s}
        color={color}
        size={size}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          styles.icon,
        ]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  } else if (isImageSource(s)) {
    return (
      <Image
        {...rest}
        source={s}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: 'contain',
          },
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  } else if (typeof s === 'function') {
    return s({ color, size, direction });
  }

  return null;
};

export default Icon;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
