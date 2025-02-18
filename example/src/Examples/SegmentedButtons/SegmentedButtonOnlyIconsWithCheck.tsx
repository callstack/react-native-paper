import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

type TransportMode = 'walk' | 'transit' | 'drive';

const SegmentedButtonOnlyIconsWithCheck = () => {
  const [value, setValue] = React.useState<TransportMode>('walk');

  return (
    <List.Section title={`Segmented Button - icons + show selected check`}>
      <SegmentedButtons<TransportMode>
        onValueChange={setValue}
        style={styles.group}
        value={value}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            showSelectedCheck: true,
          },
          {
            icon: 'train',
            value: 'transit',
            showSelectedCheck: true,
          },
          {
            icon: 'car',
            value: 'drive',
            showSelectedCheck: true,
          },
        ]}
      />
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonOnlyIconsWithCheck;
