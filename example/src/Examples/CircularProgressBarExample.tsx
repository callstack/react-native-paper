import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { FAB, List, MD2Colors, MD3Colors, TextInput } from 'react-native-paper';

import { useExampleTheme } from '..';
import CircularProgressBar from '../../../src/components/CircularProgressBar';
import ScreenWrapper from '../ScreenWrapper';

const CircularProgressBarExample = () => {
  const [progress, setProgress] = React.useState<number>(0.6);
  const [text, setText] = React.useState('0.6');
  const { isV3 } = useExampleTheme();

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.container}>
        <TextInput
          label="Progress (between 0 and 1)"
          value={text}
          onChangeText={(text) => setText(text)}
        />
      </View>
      <View style={styles.row}>
        <FAB
          size="small"
          icon={'play'}
          onPress={() => {
            const x = Number(text);
            !isNaN(x) ? setProgress(x) : null;
          }}
        />
      </View>

      <List.Section title="Default">
        <CircularProgressBar progress={progress} />
      </List.Section>

      <List.Section title="Large">
        <CircularProgressBar progress={progress} size="large" />
      </List.Section>

      <List.Section title="Custom size">
        <CircularProgressBar progress={progress} size={100} />
      </List.Section>

      <List.Section title="Custom color">
        <CircularProgressBar
          progress={progress}
          color={isV3 ? MD3Colors.error20 : MD2Colors.red500}
        />
      </List.Section>

      <List.Section title="No animation">
        <CircularProgressBar progress={progress} animating={false} />
      </List.Section>
    </ScreenWrapper>
  );
};

CircularProgressBarExample.title = 'Circular Progress Bar';

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});

export default CircularProgressBarExample;
