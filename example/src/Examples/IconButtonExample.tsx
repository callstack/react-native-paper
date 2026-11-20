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
            aria-label="Take photo"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            selected
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            disabled
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            size={24}
            onPress={() => {}}
            loading
          />
        </View>
      </List.Section>

      <List.Section title="Contained">
        <View style={styles.row}>
          <IconButton
            icon="camera"
            aria-label="Take photo"
            mode="contained"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            mode="contained"
            selected
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            mode="contained"
            disabled
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon=""
            aria-label="Refresh"
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
            aria-label="Take photo"
            mode="contained-tonal"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            selected
            mode="contained-tonal"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            mode="contained-tonal"
            disabled
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon=""
            aria-label="Refresh"
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
            aria-label="Take photo"
            mode="outlined"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            selected
            icon="camera"
            aria-label="Take photo"
            mode="outlined"
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            mode="outlined"
            disabled
            size={24}
            onPress={() => {}}
          />
          <IconButton
            icon=""
            aria-label="Refresh"
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
            aria-label="Lock"
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="eye"
            aria-label="Show"
            mode="contained"
            style={styles.square}
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="eye"
            aria-label="Show"
            mode="contained"
            style={styles.slightlyRounded}
            size={24}
            contentStyle={styles.contentPadding}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="heart"
            aria-label="Favorite"
            mode="contained-tonal"
            style={styles.differentBorderRadius}
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="heart"
            aria-label="Favorite"
            mode="outlined"
            style={styles.differentBorderRadius}
            size={24}
            iconColor={Palette.tertiary50}
            onPress={() => {}}
          />
          <IconButton
            icon="camera"
            aria-label="Take photo"
            size={36}
            onPress={() => {}}
          />
          <IconButton
            icon="lock"
            aria-label="Lock"
            size={36}
            onPress={() => {}}
            containerColor={Palette.tertiary60}
          />
          <IconButton
            icon="heart"
            aria-label="Favorite"
            size={60}
            onPress={() => {}}
          />
          <IconButton
            icon=""
            aria-label="Refresh"
            size={60}
            onPress={() => {}}
            loading
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
