import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import {
  Button,
  ProgressBar,
  Paragraph,
  MD2Colors,
  MD3Colors,
  useTheme,
  ProgressBarProps,
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
  const [visible, setVisible] = React.useState<boolean>(true);
  const [progress, setProgress] = React.useState<number>(0.3);
  const theme = useTheme();
  const { isV3 } = theme;
  const progressBarValue = React.useRef(new Animated.Value(0));

  const customAnim = () => {
    Animated.timing(progressBarValue.current, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
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
          color={isV3 ? MD3Colors.error50 : MD2Colors.red800}
        />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom background color</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          color={MD2Colors.red800}
          style={{
            backgroundColor: isV3 ? MD3Colors.secondary50 : MD2Colors.teal500,
          }}
        />
      </View>

      <View style={styles.row}>
        <Paragraph>ProgressBar with custom height</Paragraph>
        <ProgressBar
          progress={progress}
          visible={visible}
          style={styles.customHeight}
        />
      </View>

      <Button onPress={customAnim}>Animated Value</Button>
      <AnimatedProgressBar
        style={styles.progressBar}
        animatedValue={progressBarValue.current}
        color={MD2Colors.green200}
        theme={theme}
      />
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
  customHeight: {
    height: 20,
  },
  progressBar: {
    borderRadius: 7.5,
    height: 15,
  },
});

export default ProgressBarExample;
