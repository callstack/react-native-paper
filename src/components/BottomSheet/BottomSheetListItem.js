/* @flow */

import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';
import Text from '../Typography/Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types/Theme';

type Props = {
  icon?: string,
  image?: number | Object,
  label: string,
  style?: any,
  theme: Theme,
};

const BottomSheetListItem = (props: Props) => {
  const { text } = props.theme.colors;
  return (
    <TouchableRipple {...props}>
      <View style={styles.container}>
        {props.icon && !props.image
          ? <Icon
              name={props.icon}
              size={24}
              style={[styles.icon, { color: text }]}
            />
          : null}
        {!props.icon && props.image
          ? <Image source={props.image} style={styles.image} />
          : null}
        <Text style={[styles.label, { color: text }]}>
          {props.label}
        </Text>
      </View>
    </TouchableRipple>
  );
};

BottomSheetListItem.propTypes = {
  icon: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  label: PropTypes.string.isRequired,
  style: View.propTypes.style,
  theme: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  icon: {
    height: 24,
    width: 24,
    opacity: 0.64,
    marginRight: 32,
  },
  image: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginRight: 32,
  },
  label: {
    fontSize: 16,
  },
});

export default withTheme(BottomSheetListItem);
