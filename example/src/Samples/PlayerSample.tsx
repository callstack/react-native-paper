import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Icon,
  ProgressBar,
  SegmentedButtons,
  Surface,
  Text,
  ToggleButton,
} from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const PlayerSampleConfig: SampleConfig = {
  title: 'Now playing',
  icon: 'play-circle-outline',
  components: [
    'Icon',
    'ProgressBar',
    'SegmentedButtons',
    'Surface',
    'Text',
    'ToggleButton',
  ],
};

const PlayerSample = () => {
  const [repeat, setRepeat] = React.useState('off');
  const [speed, setSpeed] = React.useState('1');

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Surface style={styles.cover}>
        <Icon source="music-note" size={72} />
      </Surface>

      <View>
        <Text variant="titleLarge">Nightfall</Text>
        <Text variant="bodyMedium">Aurora Skies · Long Way Home</Text>
      </View>

      <ProgressBar progress={0.45} />

      <ToggleButton.Row
        value={repeat}
        onValueChange={(value) => value && setRepeat(value)}
      >
        <ToggleButton icon="repeat-off" value="off" />
        <ToggleButton icon="repeat-once" value="one" />
        <ToggleButton icon="repeat" value="all" />
      </ToggleButton.Row>

      <SegmentedButtons
        value={speed}
        onValueChange={setSpeed}
        buttons={[
          { value: '0.5', label: '0.5x' },
          { value: '1', label: '1x' },
          { value: '1.5', label: '1.5x' },
          { value: '2', label: '2x' },
        ]}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 24,
  },
  cover: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
});

export default PlayerSample;
