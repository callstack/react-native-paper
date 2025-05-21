import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import {
  Button,
  ProgressBar,
  Colors,
  ProgressBarProps,
  Text,
  useTheme,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

class ClassProgressBar extends React.Component {
  constructor(props: ProgressBarProps) {
    super(props);
  }

  render() {
    return <ProgressBar {...this.props} />;
  }
}

const AnimatedProgressBar = Animated.createAnimatedComponent(ClassProgressBar);

const ProgressBarExample = () => {
  const theme = useTheme();

  const [visible, setVisible] = React.useState(true);
  const [progress, setProgress] = React.useState(0.3);
  const { current: progressBarValue } = React.useRef(new Animated.Value(0));

  const runCustomAnimation = () => {
    progressBarValue.setValue(0);
    Animated.timing(progressBarValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <Button onPress={() => setVisible(!visible)}>Toggle visibility</Button>
      <Button onPress={() => setProgress(Math.random())}>
        Random progress
      </Button>
      <Button onPress={runCustomAnimation}>Toggle animation</Button>

      <View style={styles.row}>
        <Text variant="bodyMedium">Default ProgressBar</Text>
        <ProgressBar progress={progress} visible={visible} />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">Indeterminate ProgressBar</Text>
        <ProgressBar indeterminate visible={visible} />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">ProgressBar with custom color</Text>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={Colors.error50}
        />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">
          ProgressBar with custom background color
        </Text>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={Colors.error50}
          style={{
            backgroundColor: Colors.secondary50,
          }}
        />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">ProgressBar with custom height</Text>
        <ProgressBar
          progress={progress}
          visible={visible}
          style={styles.customHeight}
        />
      </View>

      <View style={styles.row}>
        <Text variant="bodyMedium">ProgressBar with animated value</Text>
        <AnimatedProgressBar
          visible={visible}
          style={styles.progressBar}
          animatedValue={progressBarValue}
          theme={theme}
        />
      </View>

      <View style={[styles.row, styles.fullRow]}>
        <Text variant="bodyMedium">
          ProgressBar with custom percentage height
        </Text>
        <ProgressBar
          style={styles.customPercentageHeight}
          indeterminate
          visible={visible}
        />
      </View>
    </ScreenWrapper>
  );
};

ProgressBarExample.title = 'Progress Bar';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    marginVertical: 10,
  },
  fullRow: {
    height: '100%',
    width: '100%',
  },
  customHeight: {
    height: 20,
  },
  customPercentageHeight: {
    height: '50%',
  },
  progressBar: {
    height: 15,
  },
});

export default ProgressBarExample;
