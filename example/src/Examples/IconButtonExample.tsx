import * as React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, MD2Colors, MD3Colors, useTheme } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  const { isV3 } = useTheme();
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <IconButton icon="camera" size={24} onPress={() => {}} />
      <IconButton
        icon="lock"
        size={24}
        color={isV3 ? MD3Colors.tertiary50 : MD2Colors.green500}
        onPress={() => {}}
      />
      <IconButton icon="camera" size={36} onPress={() => {}} />
      <IconButton
        icon="lock"
        size={36}
        onPress={() => {}}
        style={{
          backgroundColor: isV3
            ? MD3Colors.tertiary50
            : MD2Colors.lightGreen200,
        }}
      />
      <IconButton icon="heart" size={60} onPress={() => {}} />
    </ScreenWrapper>
  );
};

ButtonExample.title = 'Icon Button';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
  },
});

export default ButtonExample;
