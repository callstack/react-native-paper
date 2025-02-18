import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

type TransportMode = 'walk' | 'transit' | 'drive';

const SegmentedButtonWithDensity = () => {
  const [value, setValue] = React.useState<TransportMode>('walk');

  return (
    <List.Section title={`Segmented Button - only labels + density`}>
      <SegmentedButtons<TransportMode>
        onValueChange={setValue}
        value={value}
        density="medium"
        style={styles.group}
        buttons={[
          {
            style: styles.button,
            value: 'walk',
            label: 'Walking',
          },
          {
            style: styles.button,
            value: 'transit',
            label: 'Transit',
          },
          {
            style: styles.button,
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
