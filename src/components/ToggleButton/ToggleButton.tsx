import ToggleButtonComponent from './ToggleButtonComponent';
import ToggleButtonGroup from './ToggleButtonGroup';
import ToggleButtonRow from './ToggleButtonRow';

const ToggleButton = Object.assign(ToggleButtonComponent, {
  // @component ./ToggleButtonGroup.tsx
  Group: ToggleButtonGroup,
  // @component ./ToggleButtonRow.tsx
  Row: ToggleButtonRow,
});

export default ToggleButton;
