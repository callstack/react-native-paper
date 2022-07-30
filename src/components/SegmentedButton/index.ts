import SegmentedButtonComponent from './SegmentedButton';
import SegmentedButtonGroup from './SegmentedButtonGroup';

const SegmentedButton = Object.assign(
  // @component ./SegmentedButton.tsx
  SegmentedButtonComponent,
  {
    // @component ./SegmentedButtonGroup.tsx
    Group: SegmentedButtonGroup,
  }
);

export default SegmentedButton;
