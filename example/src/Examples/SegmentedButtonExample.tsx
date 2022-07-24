import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, SegmentedButton } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const SegmentedButtonExample = () => {
  return (
    <ScreenWrapper>
      <List.Section title={`Segmented Button`}>
        <View style={styles.row}>
          <SegmentedButton
            segment="first"
            icon="android"
            onPress={() => {}}
            showSelectedCheck
            style={styles.button}
            value="day"
            label="Day"
          />
          <SegmentedButton
            status="checked"
            showSelectedCheck
            onPress={() => {}}
            style={styles.button}
            label="Week"
          />
          <SegmentedButton
            segment="last"
            onPress={() => {}}
            style={styles.button}
            icon="calendar"
            label="Month"
          />
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

SegmentedButtonExample.title = 'SegmentedButton';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
});

export default SegmentedButtonExample;
