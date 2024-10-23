import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

type TransportMode = 'walk' | 'disabled' | 'drive';

const SegmentedButtonDisabled = () => {
  const [value, setValue] = React.useState<TransportMode>('walk');

  return (
    <List.Section title={`Segmented Button - disabled`}>
      <SegmentedButtons<TransportMode>
        onValueChange={setValue}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            style: styles.button,
          },
          {
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
            style: styles.button,
          },
          {
            value: 'drive',
            label: 'Driving',
            style: styles.button,
          },
        ]}
        value={value}
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

export default SegmentedButtonDisabled;
