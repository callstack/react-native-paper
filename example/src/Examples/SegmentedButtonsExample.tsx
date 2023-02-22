import * as React from 'react';

import type { StackNavigationProp } from '@react-navigation/stack';
import { List } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';
import {
  SegmentedButtonDefault,
  SegmentedButtonDisabled,
  SegmentedButtonMultiselect,
  SegmentedButtonMultiselectIcons,
  SegmentedButtonOnlyIcons,
  SegmentedButtonOnlyIconsWithCheck,
  SegmentedButtonWithDensity,
  SegmentedButtonWithSelectedCheck,
  SegmentButtonCustomColorCheck,
} from './SegmentedButtons';

type Props = {
  navigation: StackNavigationProp<{ [key: string]: undefined }>;
};

const SegmentedButtonExample = ({ navigation }: Props) => {
  return (
    <ScreenWrapper>
      <List.Section title={`Segmented Button Example Usage`}>
        <List.Item
          title="Single select"
          description="Go to the example"
          onPress={() => navigation.navigate('segmentedButtonRealCase')}
          right={(props) => <List.Icon {...props} icon="arrow-right" />}
        />
        <List.Item
          title="Multiselect select"
          description="Go to the example"
          onPress={() =>
            navigation.navigate('segmentedButtonMultiselectRealCase')
          }
          right={(props) => <List.Icon {...props} icon="arrow-right" />}
        />
      </List.Section>
      <SegmentedButtonDefault />
      <SegmentedButtonWithSelectedCheck />
      <SegmentedButtonOnlyIconsWithCheck />
      <SegmentedButtonWithDensity />
      <SegmentedButtonOnlyIcons />
      <SegmentedButtonMultiselect />
      <SegmentedButtonMultiselectIcons />
      <SegmentButtonCustomColorCheck />
      <SegmentedButtonDisabled />
    </ScreenWrapper>
  );
};

SegmentedButtonExample.title = 'Segmented Buttons';

export default SegmentedButtonExample;
