import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButtons } from 'react-native-paper';

const SegmentedButtonWithDensity = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - only labels + density`}>
      <SegmentedButtons
        onValueChange={(value) => {
          setValue(value);
        }}
        value={value}
        style={styles.group}
        buttons={[
          {
            style: styles.button,
            density: -2,
            value: 'walk',
            label: 'Walking',
          },
          {
            style: styles.button,
            density: -2,
            value: 'transit',
            label: 'Transit',
          },
          {
            style: styles.button,
            density: -2,
            value: 'drive',
            label: 'Driving',
          },
        ]}
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

export default SegmentedButtonWithDensity;
