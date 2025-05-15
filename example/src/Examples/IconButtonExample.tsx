import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, List, Colors } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.v3Container}>
      <List.Section title="Default">
        <View style={styles.row}>
          <IconButton icon="camera" size={24} onPress={() => {}} />
          <IconButton icon="camera" selected size={24} onPress={() => {}} />
          <IconButton icon="camera" disabled size={24} onPress={() => {}} />
          <IconButton icon="camera" size={24} onPress={() => {}} loading />
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
          <IconButton
            icon=""
            mode="contained"
            selected
            loading
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
          <IconButton
            icon=""
            mode="contained-tonal"
            disabled
            size={24}
            onPress={() => {}}
            loading
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
          <IconButton
            icon=""
            mode="outlined"
            disabled
            size={24}
            onPress={() => {}}
            loading
          />
        </View>
      </List.Section>

      <List.Section title="Custom">
        <View style={styles.row}>
          <IconButton
            icon="lock"
            size={24}
            iconColor={Colors.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="eye"
            mode="contained"
            style={styles.square}
            size={24}
            iconColor={Colors.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="eye"
            mode="contained"
            style={styles.slightlyRounded}
            size={24}
            contentStyle={styles.padding}
            iconColor={Colors.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="heart"
            mode="contained-tonal"
            style={styles.differentBorderRadius}
            size={24}
            iconColor={Colors.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="heart"
            mode="outlined"
            style={styles.differentBorderRadius}
            size={24}
            iconColor={Colors.tertiary50}
            onPress={() => {}}
          />
          <IconButton icon="camera" size={36} onPress={() => {}} />
          <IconButton
            icon="lock"
            size={36}
            onPress={() => {}}
            containerColor={Colors.tertiary60}
          />
          <IconButton icon="heart" size={60} onPress={() => {}} />
          <IconButton icon="" size={60} onPress={() => {}} loading />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

ButtonExample.title = 'Icon Button';

const styles = StyleSheet.create({
  v3Container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    flexWrap: 'wrap',
  },
  square: {
    borderRadius: 0,
  },
  slightlyRounded: {
    borderRadius: 4,
    width: 48,
    height: 48,
  },
  differentBorderRadius: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 6,
  },
  padding: {
    padding: 8,
  },
});

export default ButtonExample;
