/* @flow */

import * as React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type IconSource = string | { uri: string } | number | React.Node;

export type Props = {
  name: IconSource,
  color: string,
  size?: number,
  style?: any,
};

const Icon = ({ name, ...props }: Props) => {
  if (typeof name === 'string') {
    return <MaterialIcons {...props} name={name} />;
  } else if (
    (typeof name === 'object' &&
      name !== null &&
      (Object.prototype.hasOwnProperty.call(name, 'uri') &&
        typeof name.uri === 'string')) ||
    typeof name === 'number'
  ) {
    return (
      <Image
        {...props}
        source={name}
        style={[
          {
            width: props.size,
            height: props.size,
            tintColor: props.color,
          },
          props.style,
        ]}
      />
    );
  }
  return (
    <View
      {...props}
      style={[
        {
          width: props.size,
          height: props.size,
        },
        styles.container,
        props.style,
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
