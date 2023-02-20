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

const SegmentedButtonCustomTheme = () => {
  const [value, setValue] = React.useState('');

  return (
    <List.Section title={`Segmented Button - Custom Theme`}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
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
    </List.Section>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonCustomTheme;
