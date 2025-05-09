import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import color from 'color';
import { Chip, List, MD3Colors, Snackbar, Text } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const ChipExample = () => {
  const [snackbarProperties, setSnackbarProperties] = React.useState({
    visible: false,
    text: '',
  });
  const customColor = MD3Colors.error50;

  return (
    <>
      <ScreenWrapper>
        <List.Section title="Flat chip">
          <View style={styles.row}>
            <Chip selected onPress={() => {}} style={styles.chip}>
              Simple
            </Chip>
            <Chip
              selected
              showSelectedOverlay
              onPress={() => {}}
              style={styles.chip}
            >
              With selected overlay
            </Chip>
            <Chip elevated onPress={() => {}} style={styles.chip}>
              Elevated
            </Chip>
            <Chip compact style={styles.chip} onPress={() => {}}>
              Compact chip
            </Chip>
            <Chip
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Close button pressed',
                })
              }
              style={styles.chip}
              closeIconAccessibilityLabel="Close icon accessibility label"
            >
              Close button
            </Chip>
            <Chip
              icon="heart"
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Heart icon close button pressed',
                })
              }
              style={styles.chip}
            >
              Icon
            </Chip>
            <Chip
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Avatar close button pressed',
                })
              }
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
              Avatar (selected)
            </Chip>
            <Chip
              disabled
              icon="heart"
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Disabled heart icon close button pressed',
                })
              }
              style={styles.chip}
            >
              Icon (disabled)
            </Chip>
            <Chip
              disabled
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              style={styles.chip}
            >
              Avatar (disabled)
            </Chip>
          </View>
        </List.Section>
        <List.Section title="Outlined chip">
          <View style={styles.row}>
            <Chip mode="outlined" onPress={() => {}} style={styles.chip}>
              Simple
            </Chip>
            <Chip
              mode="outlined"
              selected
              showSelectedOverlay
              onPress={() => {}}
              style={styles.chip}
            >
              With selected overlay
            </Chip>
            <Chip
              mode="outlined"
              elevated
              onPress={() => {}}
              style={styles.chip}
            >
              Elevated
            </Chip>
            <Chip
              mode="outlined"
              compact
              onPress={() => {}}
              style={styles.chip}
            >
              Compact chip
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Close button pressed',
                })
              }
              style={styles.chip}
            >
              Close button
            </Chip>
            <Chip
              mode="outlined"
              icon="heart"
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Heart icon close button pressed',
                })
              }
              style={styles.chip}
            >
              Icon
            </Chip>
            <Chip
              mode="outlined"
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
              mode="outlined"
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              onPress={() => {}}
              style={styles.chip}
            >
              Avatar (selected)
            </Chip>
            <Chip
              disabled
              mode="outlined"
              icon="heart"
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Disabled close button pressed',
                })
              }
              style={styles.chip}
            >
              Icon (disabled)
            </Chip>
            <Chip
              disabled
              mode="outlined"
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              style={styles.chip}
            >
              Avatar (disabled)
            </Chip>
          </View>
        </List.Section>
        <List.Section title="Custom chip">
          <View style={styles.row}>
            <Chip
              mode="outlined"
              onPress={() => {}}
              compact
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              style={[styles.chip, styles.customBorderRadius]}
            >
              Compact with custom border radius
            </Chip>
            <Chip
              mode="flat"
              onPress={() => {}}
              compact
              avatar={
                <Image
                  source={require('../../assets/images/avatar.png')}
                  accessibilityIgnoresInvertColors
                />
              }
              style={[styles.chip, styles.customBorderRadius]}
            >
              Compact with custom border radius
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => {}}
              onLongPress={() =>
                setSnackbarProperties({ visible: true, text: '' })
              }
              style={styles.chip}
            >
              With onLongPress
            </Chip>
            <Chip
              selected
              onPress={() => {}}
              style={[
                styles.chip,
                {
                  backgroundColor: color(customColor).alpha(0.2).rgb().string(),
                },
              ]}
              selectedColor={customColor}
            >
              Flat selected chip with custom color
            </Chip>
            <Chip
              onPress={() => {}}
              style={styles.chip}
              selectedColor={customColor}
            >
              Flat unselected chip with custom color
            </Chip>
            <Chip
              selected
              mode="outlined"
              onPress={() => {}}
              style={[
                styles.chip,
                {
                  backgroundColor: color(customColor).alpha(0.2).rgb().string(),
                },
              ]}
              selectedColor={customColor}
            >
              Outlined selected chip with custom color
            </Chip>
            <Chip
              mode="outlined"
              onPress={() => {}}
              style={styles.chip}
              selectedColor={customColor}
            >
              Outlined unselected chip with custom color
            </Chip>
            <Chip
              onPress={() => {}}
              style={styles.chip}
              textStyle={styles.tiny}
            >
              With custom size
            </Chip>
            <Chip
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Close button pressed',
                })
              }
              style={styles.bigTextFlex}
              textStyle={styles.bigTextStyle}
              ellipsizeMode="middle"
            >
              With a very big text: React Native Paper is a high-quality,
              standard-compliant Material Design library that has you covered in
              all major use-cases.
            </Chip>
            <Chip
              onPress={() => {}}
              onClose={() =>
                setSnackbarProperties({
                  visible: true,
                  text: 'Custom icon close button pressed',
                })
              }
              closeIcon="arrow-down"
              style={styles.chip}
              closeIconAccessibilityLabel="Custom Close icon accessibility label"
            >
              With custom close icon
            </Chip>
            <Chip
              onPress={() => {}}
              style={styles.chip}
              textStyle={styles.tiny}
            >
              <Text variant="titleLarge">With custom text</Text>
            </Chip>
          </View>
          <Chip mode="outlined" onPress={() => {}} style={styles.fullWidthChip}>
            Full width chip
          </Chip>
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
  tiny: {
    marginVertical: 2,
    marginRight: 2,
    marginLeft: 2,
    minHeight: 19,
    lineHeight: 19,
  },
  bigTextFlex: {
    flex: 1,
  },
  bigTextStyle: {
    flex: -1,
  },
  fullWidthChip: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
  customBorderRadius: {
    borderRadius: 16,
  },
});

export default ChipExample;
