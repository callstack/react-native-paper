import { StyleSheet, View } from 'react-native';

import { IconButton, List, Palette } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const ButtonExample = () => {
  return (
    <ScreenWrapper contentContainerStyle={styles.v3Container}>
      <List.Section title="Default">
        <View style={styles.row}>
          <IconButton
            icon="camera"
            size={24}
            onPress={() => {}}
            aria-label="Camera default"
          />
          <IconButton
            icon="camera"
            selected
            size={24}
            onPress={() => {}}
            aria-label="Camera default selected"
          />
          <IconButton
            icon="camera"
            disabled
            size={24}
            onPress={() => {}}
            aria-label="Camera default disabled"
          />
          <IconButton
            icon="camera"
            size={24}
            onPress={() => {}}
            loading
            aria-label="Camera default loading"
          />
        </View>
      </List.Section>

      <List.Section title="Contained">
        <View style={styles.row}>
          <IconButton
            icon="camera"
            mode="contained"
            size={24}
            onPress={() => {}}
            aria-label="Camera contained"
          />
          <IconButton
            icon="camera"
            mode="contained"
            selected
            size={24}
            onPress={() => {}}
            aria-label="Camera contained selected"
          />
          <IconButton
            icon="camera"
            mode="contained"
            disabled
            size={24}
            onPress={() => {}}
            aria-label="Camera contained disabled"
          />
          <IconButton
            icon=""
            mode="contained"
            selected
            loading
            size={24}
            onPress={() => {}}
            aria-label="Camera contained loading"
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
            aria-label="Camera contained tonal"
          />
          <IconButton
            icon="camera"
            selected
            mode="contained-tonal"
            size={24}
            onPress={() => {}}
            aria-label="Camera contained tonal selected"
          />
          <IconButton
            icon="camera"
            mode="contained-tonal"
            disabled
            size={24}
            onPress={() => {}}
            aria-label="Camera contained tonal disabled"
          />
          <IconButton
            icon=""
            mode="contained-tonal"
            disabled
            size={24}
            onPress={() => {}}
            loading
            aria-label="Camera contained tonal loading"
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
            aria-label="Camera outline"
          />
          <IconButton
            selected
            icon="camera"
            mode="outlined"
            size={24}
            onPress={() => {}}
            aria-label="Camera outlined selected"
          />
          <IconButton
            icon="camera"
            mode="outlined"
            disabled
            size={24}
            onPress={() => {}}
            aria-label="Camera outlined disabled"
          />
          <IconButton
            icon=""
            mode="outlined"
            disabled
            size={24}
            onPress={() => {}}
            loading
            aria-label="Camera outlined loading"
          />
        </View>
      </List.Section>

      <List.Section title="Custom">
        <View style={styles.row}>
          <IconButton
            icon="lock"
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
            aria-label="Lock"
          />
          <IconButton
            icon="eye"
            mode="contained"
            style={styles.square}
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
            aria-label="Eye square"
          />
          <IconButton
            icon="eye"
            mode="contained"
            style={styles.slightlyRounded}
            size={24}
            contentStyle={styles.contentPadding}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
            aria-label="Eye slightly rounded"
          />
          <IconButton
            icon="heart"
            mode="contained-tonal"
            style={styles.differentBorderRadius}
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
            aria-label="Heart contained tonal"
          />
          <IconButton
            icon="heart"
            mode="outlined"
            style={styles.differentBorderRadius}
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
            aria-label="Heart outlined"
          />
          <IconButton
            icon="camera"
            size={36}
            onPress={() => {}}
            aria-label="Camera medium"
          />
          <IconButton
            icon="lock"
            size={36}
            onPress={() => {}}
            containerColor={Palette.tertiary60}
            aria-label="Lock medium with container color"
          />
          <IconButton
            icon="heart"
            size={60}
            onPress={() => {}}
            aria-label="Heart large"
          />
          <IconButton
            icon=""
            size={60}
            onPress={() => {}}
            loading
            aria-label="Heart large loading"
          />
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
  },
  square: {
    borderRadius: 0,
  },
  slightlyRounded: {
    borderRadius: 4,
    width: 48,
    height: 48,
  },
  contentPadding: {
    padding: 8,
  },
  differentBorderRadius: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 6,
  },
});

export default ButtonExample;
