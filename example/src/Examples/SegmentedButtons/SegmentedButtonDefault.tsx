import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

const SegmentedButtonDefault = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button`}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'walk',
            icon: 'walk',
            label: 'Walking',
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
    </List.Section>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonDefault;
