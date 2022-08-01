import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const SegmentedButtonExample = () => {
  const [first, setFirst] = React.useState('week');
  const [second, setSecond] = React.useState('');
  const [third, setThird] = React.useState('');
  const [fourth, setFourth] = React.useState<string[]>([]);

  return (
    <ScreenWrapper>
      <List.Section title={`Segmented Button`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setFirst(value);
          }}
          value={first}
          style={styles.group}
        >
          <SegmentedButton
            icon="walk"
            style={styles.button}
            value="walk"
            label="Walking"
          />
          <SegmentedButton
            style={styles.button}
            icon="train"
            label="Transit"
            value="transit"
          />
          <SegmentedButton
            style={styles.button}
            icon="car"
            label="Driving"
            value="drive"
          />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section title={`Segmented Button - only labels`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setSecond(value);
          }}
          value={second}
          style={styles.group}
        >
          <SegmentedButton style={styles.button} value="walk" label="Walking" />
          <SegmentedButton
            style={styles.button}
            label="Transit"
            value="transit"
          />
          <SegmentedButton
            style={styles.button}
            label="Driving"
            value="drive"
          />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section title={`Segmented Button - only icons`}>
        <SegmentedButton.Group
          onValueChange={(value) => {
            typeof value === 'string' && setThird(value);
          }}
          style={styles.group}
          value={third}
        >
          <SegmentedButton icon="walk" value="walk" />
          <SegmentedButton icon="train" value="transit" />
          <SegmentedButton icon="car" value="drive" />
        </SegmentedButton.Group>
      </List.Section>
      <List.Section title={`Segmented Button - multiselect`}>
        <SegmentedButton.Group
          multiselect
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setFourth(value);
            }
          }}
          value={fourth}
          style={styles.group}
        >
          <SegmentedButton style={styles.button} value="walk" label="Walking" />
          <SegmentedButton
            style={styles.button}
            label="Transit"
            value="transit"
          />
          <SegmentedButton
            style={styles.button}
            label="Driving"
            value="drive"
          />
        </SegmentedButton.Group>
      </List.Section>
    </ScreenWrapper>
  );
};

SegmentedButtonExample.title = 'SegmentedButton';

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

export default SegmentedButtonExample;
