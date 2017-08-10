/* @flow */

import color from 'color';
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { grey300, grey700 } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  icon?: string,
  label: string,
  active?: boolean,
  onPress?: Function,
  theme: Theme,
};

const DrawerItem = ({
  icon,
  label,
  active,
  onPress,
  theme,
  ...props
}: Props) => {
  const { colors, dark } = theme;
  const backgroundColor = active ? (dark ? grey700 : grey300) : 'transparent';
  const labelColor = active
    ? colors.primary
    : color(colors.text).alpha(0.87).rgbaString();
  const iconColor = active
    ? colors.primary
    : color(colors.text).alpha(0.54).rgbaString();
  const fontFamily = theme.fonts.medium;
  const labelMargin = icon ? 32 : 0;
  return (
    <TouchableRipple {...props} onPress={onPress}>
      <View style={[styles.wrapper, { backgroundColor }]}>
        {icon && <Icon name={icon} size={24} color={iconColor} />}
        <Text
          numberOfLines={1}
          style={{
            color: labelColor,
            fontFamily,
            marginLeft: labelMargin,
            marginRight: 16,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 48,
  },
});

DrawerItem.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onPress: PropTypes.func,
  theme: PropTypes.object.isRequired,
};

export default withTheme(DrawerItem);
