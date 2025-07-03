import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

type TransportMode = 'walk' | 'train' | 'drive';

const SegmentedButtonWithSelectedCheck = () => {
  const [value, setValue] = React.useState<TransportMode>('walk');

  return (
    <List.Section title={`Segmented Button - show selected check`}>
      <SegmentedButtons
        onValueChange={setValue}
        value={value}
        style={styles.group}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            label: 'Walking',
            showSelectedCheck: true,
            style: styles.button,
          },
          {
            icon: 'train',
            value: 'train',
            label: 'Transit',
            showSelectedCheck: true,
            style: styles.button,
          },
          {
            icon: 'car',
            value: 'drive',
            label: 'Driving',
            showSelectedCheck: true,
            style: styles.button,
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

export default SegmentedButtonWithSelectedCheck;
