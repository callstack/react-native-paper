import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import color from 'color';
import { Chip, List, Palette, Snackbar } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const filters = ['All', 'Unread', 'Starred'];

const ChipExample = () => {
  const [selectedFilter, setSelectedFilter] = React.useState(filters[0]);
  const [snackbarProperties, setSnackbarProperties] = React.useState({
    visible: false,
    text: '',
  });
  const customColor = Palette.error50;

  return (
    <>
      <ScreenWrapper>
        <List.Section title="Filter chips">
          <View style={styles.row}>
            {filters.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
                style={styles.chip}
              />
            ))}
            <Chip
              label="With icon"
              icon="tag"
              selected
              onPress={() => {}}
              style={styles.chip}
            />
            <Chip
              label="No check"
              selected
              showSelectedCheck={false}
              onPress={() => {}}
              style={styles.chip}
            />
            <Chip label="Disabled" disabled style={styles.chip} />
          </View>
        </List.Section>

        <List.Section title="Assist chips">
          <View style={styles.row}>
            <Chip
              label="Outlined"
              icon="information"
              onPress={() => {}}
              style={styles.chip}
            />
            <Chip
              label="Flat"
              icon="calendar"
              mode="flat"
              onPress={() => {}}
              style={styles.chip}
            />
            <Chip
              label="Elevated"
              icon="map-marker"
              elevated
              mode="flat"
              onPress={() => {}}
              style={styles.chip}
            />
          </View>
        </List.Section>

        <List.Section title="Input chips">
          <View style={styles.row}>
            <Chip
              label="Avatar"
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              onPress={() => {}}
              style={styles.chip}
            />
            <Chip
              label="Selected avatar"
              selected
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              onPress={() => {}}
              style={styles.chip}
            />
            <Chip
              label="Removable"
              icon="file-document"
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Close button pressed',
                })
              }
              style={styles.chip}
            />
            <Chip
              label="Custom close"
              closeIcon="arrow-down"
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Custom close button pressed',
                })
              }
              style={styles.chip}
              closeIconAccessibilityLabel="Custom close icon accessibility label"
            />
          </View>
        </List.Section>

        <List.Section title="Custom styling">
          <View style={styles.row}>
            <Chip
              label="Custom color"
              mode="flat"
              selected
              icon="palette"
              onPress={() => {}}
              selectedColor={customColor}
              style={[
                styles.chip,
                {
                  backgroundColor: color(customColor).alpha(0.2).rgb().string(),
                },
              ]}
            />
            <Chip
              label="Rounded"
              onPress={() => {}}
              style={[styles.chip, styles.customBorderRadius]}
            />
            <Chip
              label="Full width chip"
              onPress={() => {}}
              style={styles.fullWidthChip}
            />
          </View>
        </List.Section>
      </ScreenWrapper>
      <Snackbar
        visible={snackbarProperties.visible}
        onDismiss={() => setSnackbarProperties({ visible: false, text: '' })}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarProperties.text}
      </Snackbar>
    </>
  );
};

ChipExample.title = 'Chip';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  chip: {
    margin: 4,
  },
  fullWidthChip: {
    flex: 1,
    margin: 4,
  },
  customBorderRadius: {
    borderRadius: 16,
  },
});

export default ChipExample;
