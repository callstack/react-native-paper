import * as React from 'react';

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
} from './SegmentedButtons';

const SegmentedButtonExample = () => (
  <ScreenWrapper>
    <SegmentedButtonDefault />
    <SegmentedButtonWithSelectedCheck />
    <SegmentedButtonOnlyIconsWithCheck />
    <SegmentedButtonWithDensity />
    <SegmentedButtonOnlyIcons />
    <SegmentedButtonMultiselect />
    <SegmentedButtonMultiselectIcons />
    <SegmentedButtonDisabled />
  </ScreenWrapper>
);

SegmentedButtonExample.title = 'Segmented Buttons';

export default SegmentedButtonExample;
