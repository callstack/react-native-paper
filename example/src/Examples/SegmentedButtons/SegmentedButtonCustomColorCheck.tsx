import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

const themeMock = {
  colors: {
    onSurface: '#a1f5f5',
    secondaryContainer: '#a1f5f5',
    onSecondaryContainer: '#000000',
  }
}

const SegmentButtonCustomColorCheck = () => {
  const [themeValue, setThemeValue ] = React.useState('');
  const [colorValue, setColorValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - Custom Colors`}>
      <List.Subheader>Via Theme</List.Subheader>
      <SegmentedButtons
        value={themeValue}
        onValueChange={setThemeValue}
        theme={themeMock}
        buttons={[
          {
            value: 'walk',
            icon: 'walk',
            label: 'Walking',
            disabled: true,
            style: styles.button,
          },
          {
            value: 'train',
            icon: 'train',
            label: 'Transit',
            style: styles.button,
          },
          {
            value: 'drive',
            icon: 'car',
            label: 'Driving',
            style: styles.button,
          },
        ]}
        style={styles.group}
      />
      <List.Subheader>Via Props</List.Subheader>
       <SegmentedButtons
        value={colorValue}
        onValueChange={setColorValue}
        theme={themeMock}
        buttons={[
          {
            value: 'walk',
            icon: 'walk',
            label: 'Walking',
            checkedColor: '#a125f5',
            style: styles.button,
          },
          {
            value: 'train',
            icon: 'train',
            showSelectedCheck: true,
            checkedColor: '#a125f5',
            uncheckedColor: '#000000',
            label: 'Transit',
            style: styles.button,
          },
          {
            value: 'drive',
            icon: 'car',
            checkedColor: '#a125f5',
            label: 'Driving',
            style: styles.button,
          },
        ]}
        style={styles.group}
      />
    </List.Section>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentButtonCustomColorCheck;
