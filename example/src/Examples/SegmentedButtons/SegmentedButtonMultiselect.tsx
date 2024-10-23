import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

type TransportMode = 'walk' | 'transit' | 'drive';

const SegmentedButtonMultiselect = () => {
  const [value, setValue] = React.useState<TransportMode[]>([]);

  return (
    <List.Section title={`Segmented Button - multiselect`}>
      <SegmentedButtons<TransportMode>
        multiSelect
        onValueChange={setValue}
        value={value}
        style={styles.group}
        buttons={[
          {
            style: styles.button,
            value: 'walk',
            label: 'Walking',
            showSelectedCheck: true,
          },
          {
            style: styles.button,
            value: 'transit',
            label: 'Transit',
            showSelectedCheck: true,
          },
          {
            style: styles.button,
            value: 'drive',
            label: 'Driving',
            showSelectedCheck: true,
          },
        ]}
      />
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
  button: {
    flex: 1,
  },
});

export default SegmentedButtonMultiselect;
