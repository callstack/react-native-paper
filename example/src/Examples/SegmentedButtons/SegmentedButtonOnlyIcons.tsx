import * as React from 'react';
import { StyleSheet } from 'react-native';

import { List, SegmentedButtons } from 'react-native-paper';

const SegmentedButtonOnlyIcons = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - only icons`}>
      <SegmentedButtons
        onValueChange={setValue}
        style={styles.group}
        value={value}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
          },
          {
            icon: 'train',
            value: 'trainsit',
          },
          {
            icon: 'car',
            value: 'drive',
          },
        ]}
      />
    </List.Section>
  );
};

const styles = StyleSheet.create({
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonOnlyIcons;
