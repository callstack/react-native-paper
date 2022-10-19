import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, List, MD2Colors, MD3Colors } from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  const { isV3 } = useExampleTheme();
  if (!isV3) {
    return (
      <ScreenWrapper contentContainerStyle={styles.v2Container}>
        <IconButton icon="camera" size={24} onPress={() => {}} />
        <IconButton
          icon="lock"
          size={24}
          iconColor={MD2Colors.green500}
          onPress={() => {}}
        />
        <IconButton icon="camera" size={36} onPress={() => {}} />
        <IconButton
          icon="lock"
          size={36}
          onPress={() => {}}
          style={{ backgroundColor: MD2Colors.lightGreen200 }}
        />
        <IconButton icon="heart" size={60} onPress={() => {}} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper contentContainerStyle={styles.v3Container}>
      <List.Section title="Default">
        <View style={styles.row}>
          <IconButton icon="camera" size={24} onPress={() => {}} />
          <IconButton icon="camera" selected size={24} onPress={() => {}} />
          <IconButton icon="camera" disabled size={24} onPress={() => {}} />
        </View>
      </List.Section>

      <List.Section title="Contained">
        <View style={styles.row}>
          <IconButton
            icon="camera"
            mode="contained"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            mode="contained"
            selected
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            mode="contained"
            disabled
            size={24}
            onPress={() => {}}
          />
        </View>
      </List.Section>

      <List.Section title="Contained-tonal">
        <View style={styles.row}>
          <IconButton
            icon="camera"
            mode="contained-tonal"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            selected
            mode="contained-tonal"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            mode="contained-tonal"
            disabled
            size={24}
            onPress={() => {}}
          />
        </View>
      </List.Section>

      <List.Section title="Outlined">
        <View style={styles.row}>
          <IconButton
            icon="camera-outline"
            mode="outlined"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            selected
            icon="camera"
            mode="outlined"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            mode="outlined"
            disabled
            size={24}
            onPress={() => {}}
          />
        </View>
      </List.Section>

      <List.Section title="Custom">
        <View style={styles.row}>
          <IconButton
            icon="lock"
            size={24}
            iconColor={MD3Colors.tertiary50}
            onPress={() => {}}
          />
          <IconButton icon="camera" size={36} onPress={() => {}} />
          <IconButton
            icon="lock"
            size={36}
            onPress={() => {}}
            containerColor={MD3Colors.tertiary60}
          />
          <IconButton icon="heart" size={60} onPress={() => {}} />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ButtonExample.title = 'Icon Button';

const styles = StyleSheet.create({
  v2Container: {
    flexDirection: 'row',
    padding: 8,
  },
  v3Container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
});

export default ButtonExample;
