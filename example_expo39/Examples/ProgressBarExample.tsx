import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  ProgressBar,
  Paragraph,
  Colors,
  useTheme,
} from 'react-native-paper';

const ProgressBarExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [progress, setProgress] = React.useState<number>(0.3);

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Button onPress={() => setVisible(!visible)}>Toggle visible</Button>
      <Button onPress={() => setProgress(Math.random())}>
        Random progress
      </Button>

      <View style={styles.row}>
        <Paragraph>Default ProgressBar </Paragraph>
        <ProgressBar progress={progress} visible={visible} />
      </View>

      <View style={styles.row}>
        <Paragraph>Indeterminate ProgressBar</Paragraph>
        <ProgressBar indeterminate visible={visible} />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom color</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={Colors.red800}
        />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom background color</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={Colors.red800}
          style={{ backgroundColor: Colors.teal500 }}
        />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom height</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          style={{ height: 20 }}
        />
      </View>
    </View>
  );
};

ProgressBarExample.title = 'Progress Bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  row: {
    marginVertical: 10,
  },
});

export default ProgressBarExample;
