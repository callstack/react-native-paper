import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Colors, useTheme } from 'react-native-paper';

const ButtonExample = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <IconButton icon="camera" size={24} onPress={() => {}} />
      <IconButton
        icon="lock"
        size={24}
        color={Colors.green500}
        onPress={() => {}}
      />
      <IconButton icon="camera" size={36} onPress={() => {}} />
      <IconButton
        icon="lock"
        size={36}
        onPress={() => {}}
        style={{ backgroundColor: Colors.lightGreen200 }}
      />
      <IconButton icon="heart" size={60} onPress={() => {}} />
    </View>
  );
};

ButtonExample.title = 'Icon Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
  },
});

export default ButtonExample;
