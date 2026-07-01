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
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
                style={styles.chip}
              >
                {filter}
              </Chip>
            ))}
            <Chip icon="tag" selected onPress={() => {}} style={styles.chip}>
              With icon
            </Chip>
            <Chip
              selected
              showSelectedCheck={false}
              onPress={() => {}}
              style={styles.chip}
            >
              No check
            </Chip>
            <Chip disabled style={styles.chip}>
              Disabled
            </Chip>
          </View>
        </List.Section>

        <List.Section title="Assist chips">
          <View style={styles.row}>
            <Chip icon="information" onPress={() => {}} style={styles.chip}>
              Outlined
            </Chip>
            <Chip
              icon="calendar"
              mode="flat"
              onPress={() => {}}
              style={styles.chip}
            >
              Flat
            </Chip>
            <Chip
              icon="map-marker"
              elevated
              mode="flat"
              onPress={() => {}}
              style={styles.chip}
            >
              Elevated
            </Chip>
          </View>
        </List.Section>

        <List.Section title="Input chips">
          <View style={styles.row}>
            <Chip
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              onPress={() => {}}
              style={styles.chip}
            >
              Avatar
            </Chip>
            <Chip
              selected
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              onPress={() => {}}
              style={styles.chip}
            >
              Selected avatar
            </Chip>
            <Chip
              icon="file-document"
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Close button pressed',
                })
              }
              style={styles.chip}
            >
              Removable
            </Chip>
            <Chip
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
            >
              Custom close
            </Chip>
          </View>
        </List.Section>

        <List.Section title="Custom styling">
          <View style={styles.row}>
            <Chip
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
            >
              Custom color
            </Chip>
            <Chip
              onPress={() => {}}
              style={[styles.chip, styles.customBorderRadius]}
            >
              Rounded
            </Chip>
            <Chip onPress={() => {}} style={styles.fullWidthChip}>
              Full width chip
            </Chip>
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
