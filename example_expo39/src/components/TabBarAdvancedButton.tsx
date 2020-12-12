import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { TabBg } from '../svg';

type Props = BottomTabBarButtonProps & {
  colors: Object;
  bgColor?: string;
};


export const TabBarAdvancedButton: React.FC<Props> = ({
  colors,
  bgColor,
  ...props
}) => (
  <View
    style={styles.container}
    pointerEvents="box-none"
  >
    <TabBg
      color={bgColor}
      style={styles.background}
    />
    <TouchableOpacity
      style={[styles.button, {backgroundColor: colors.customColor}]}
      onPress={props.onPress}
    >
      <Icon
        name="rocket"
        style={styles.buttonIcon}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 75,
    alignItems: 'center'
  },
  background: {
    position: 'absolute',
    top: 0,
  },
  button: {
    top: -22.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 27,
    //backgroundColor: '#E94F37',
  },
  buttonIcon: {
    fontSize: 16,
    color: '#F6F7EB'
  }
});
