/* @flow */

import * as React from 'react';
import { Image, Text, StyleSheet } from 'react-native';

let MaterialIcons;

try {
  // Optionally require vector-icons
  MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
} catch (e) {
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

export type IconSource =
  | string
  | number
  | { uri: string }
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
  if (typeof source === 'string') {
    return (
      <MaterialIcons
        {...rest}
        name={source}
        color={color}
        size={size}
        style={styles.icon}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  } else if (isImageSource(source)) {
    return (
      <Image
        {...rest}
        source={source}
        style={[
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
  } else if (typeof source === 'function') {
    return source({ color, size });
  }

  return null;
};

export default Icon;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
