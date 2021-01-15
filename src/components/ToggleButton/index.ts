import ToggleButtonComponent from './ToggleButton';
import ToggleButtonGroup from './ToggleButtonGroup';
import ToggleButtonRow from './ToggleButtonRow';

const ToggleButton = Object.assign(
  // @component ./ToggleButton.tsx
  ToggleButtonComponent,
  {
    // @component ./ToggleButtonGroup.tsx
    Group: ToggleButtonGroup,
    // @component ./ToggleButtonRow.tsx
    Row: ToggleButtonRow,
  }
);

export default ToggleButton;
