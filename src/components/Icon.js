/* @flow */
import React from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type IconSource = string | { uri: string } | number | React.Element<*>;

export type Props = {
  name: IconSource,
  size: number,
  color?: string,
  style?: any,
};

const Icon = ({ name, ...props }: Props) => {
  if (typeof name === 'string') {
    return <MaterialIcons {...props} name={name} />;
  } else if (
    (typeof name === 'object' &&
      name.hasOwnProperty('uri') &&
      typeof name.uri === 'string') ||
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
          overflow: 'hidden',
        },
        props.style,
      ]}
    >
      {name}
    </View>
  );
};

export default Icon;

Icon.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  size: PropTypes.number.isRequired,
  color: PropTypes.string,
  style: PropTypes.any,
};
