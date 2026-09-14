import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider, List, Text } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const items = ['Apple', 'Banana', 'Coconut'];

const DividerExample = () => {
  return (
    <ScreenWrapper>
      <List.Section title="Full width">
        {items.map((item) => (
          <React.Fragment key={item}>
            <List.Item title={item} />
            <Divider />
          </React.Fragment>
        ))}
      </List.Section>
      <List.Section title="Inset from the start">
        {items.map((item) => (
          <React.Fragment key={item}>
            <List.Item title={item} />
            <Divider startInset />
          </React.Fragment>
        ))}
      </List.Section>
      <List.Section title="Inset from both sides">
        {items.map((item) => (
          <React.Fragment key={item}>
            <List.Item title={item} />
            <Divider horizontalInset />
          </React.Fragment>
        ))}
      </List.Section>
      <List.Section title="Vertical">
        <View style={styles.row}>
          {items.map((item, index) => (
            <React.Fragment key={item}>
              {index > 0 && <Divider orientation="vertical" horizontalInset />}
              <Text variant="bodyLarge" style={styles.column}>
                {item}
              </Text>
            </React.Fragment>
          ))}
        </View>
      </List.Section>
    </ScreenWrapper>
  );
};

DividerExample.title = 'Divider';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  column: {
    flex: 1,
    paddingVertical: 24,
    textAlign: 'center',
  },
});

export default DividerExample;
