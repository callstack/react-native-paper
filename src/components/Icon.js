/* @flow */

import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

let MaterialIcons;

try {
  // Optionally require vector-icons
  MaterialIcons = require('react-native-vector-icons/MaterialIcons').default;
} catch (e) {
  MaterialIcons = ({ name, color, size, style, ...rest }) => {
    // eslint-disable-next-line no-console
    console.warn(
      `Tried to use the icon '${name}' in a component from 'react-native-paper', but 'react-native-vector-icons' is not installed. To remove this warning, install 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/icons.html.`
    );

    return (
      <Text {...rest} style={[{ color, fontSize: size }, style]}>
        □
      </Text>
    );
  };
}

export type IconSource = string | { uri: string } | number | React.Node;

export type Props = {
  name: IconSource,
  color: string,
  size?: number,
  style?: any,
};

const Icon = ({ name, color, size, style, ...rest }: Props) => {
  if (typeof name === 'string') {
    return (
      <MaterialIcons
        {...rest}
        name={name}
        color={color}
        size={size}
        style={style}
      />
    );
  } else if (
    (typeof name === 'object' &&
      name !== null &&
      (Object.prototype.hasOwnProperty.call(name, 'uri') &&
        typeof name.uri === 'string')) ||
    typeof name === 'number'
  ) {
    return (
      <Image
        {...rest}
        source={name}
        style={[
          {
            width: size,
            height: size,
            tintColor: color,
          },
          style,
        ]}
      />
    );
  }
  return (
    <View
      {...rest}
      style={[
        {
          width: size,
          height: size,
        },
        styles.container,
        style,
      ]}
    >
      {(name: any)}
    </View>
  );
};

export default Icon;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
