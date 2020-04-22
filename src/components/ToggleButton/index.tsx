import { ToggleButton as _ToggleButton } from './ToggleButton';

import ToggleButtonRow from './ToggleButtonRow';

import { withTheme } from '../../core/theming';

export class ToggleButton extends _ToggleButton {
  // @component ./ToggleButtonRow.tsx
  static Row = ToggleButtonRow;
}

export default withTheme(ToggleButton);
