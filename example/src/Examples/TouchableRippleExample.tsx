import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text, TouchableRipple } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const RippleExample = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <TouchableRipple
        style={styles.ripple}
        onPress={() => {}}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <View pointerEvents="none">
          <Text variant="bodyMedium">Press anywhere</Text>
        </View>
      </TouchableRipple>
    </ScreenWrapper>
  );
};

RippleExample.title = 'TouchableRipple';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ripple: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RippleExample;
