/* @flow */

import color from 'color';
import React from 'react';
import { View, Text } from 'react-native';
import Divider from './Divider';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  children: any,
  label?: string,
  theme: Theme,
};

const DrawerSection = ({ children, label, theme, ...props }: Props) => {
  const { colors, fonts } = theme;
  const labelColor = color(colors.text)
    .alpha(0.54)
    .rgbaString();
  const fontFamily = fonts.medium;

  return (
    <View {...props}>
      {label && (
        <View style={{ height: 40, justifyContent: 'center' }}>
          <Text
            numberOfLines={1}
            style={{ color: labelColor, fontFamily, marginLeft: 16 }}
          >
            {label}
          </Text>
        </View>
      )}
      {children}
      <Divider style={{ marginVertical: 4 }} />
    </View>
  );
};

export default withTheme(DrawerSection);
