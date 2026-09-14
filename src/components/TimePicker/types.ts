import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeProp } from '../../types';

export type TimePickerProps = {
  /** Currently selected time as a Date (only hour/minute are used). Controlled. */
  value: Date;
  /** Called when the user changes the time. */
  onChange: (time: Date) => void;
  /** Use a 24-hour clock instead of AM/PM. @default false */
  hours24?: boolean;
  /** Step in minutes for the minute field. @default 1 */
  minuteStep?: number;
  /** Style applied to the container. */
  style?: StyleProp<ViewStyle>;
  /** @optional */
  theme?: ThemeProp;
  /** TestID for testing. */
  testID?: string;
};
