import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Icon,
  IconButton,
  ProgressBar,
  SegmentedButtons,
  Surface,
  Text,
} from 'react-native-paper';

import type { SampleConfig } from './types';
import ScreenWrapper from '../ScreenWrapper';

export const PlayerSampleConfig: SampleConfig = {
  title: 'Now playing',
  icon: 'play-circle-outline',
  components: [
    'Icon',
    'IconButton',
    'ProgressBar',
    'SegmentedButtons',
    'Surface',
    'Text',
  ],
};

const repeatModes = [
  { value: 'off', icon: 'repeat-off', label: 'Repeat off' },
  { value: 'one', icon: 'repeat-once', label: 'Repeat one' },
  { value: 'all', icon: 'repeat', label: 'Repeat all' },
];

const PlayerSample = () => {
  const [repeat, setRepeat] = React.useState('off');
  const [speed, setSpeed] = React.useState('1');

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Surface borderRadius={16} style={styles.cover}>
        <Icon source="music-note" size={72} />
      </Surface>

      <View>
        <Text variant="titleLarge">Nightfall</Text>
        <Text variant="bodyMedium">Aurora Skies · Long Way Home</Text>
      </View>

      <ProgressBar progress={0.45} />

      <View style={styles.row}>
        {repeatModes.map(({ value, icon, label }) => (
          <IconButton
            key={value}
            icon={icon}
            selected={repeat === value}
            aria-label={label}
            onPress={() => setRepeat(value)}
          />
        ))}
      </View>

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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cover: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerSample;
