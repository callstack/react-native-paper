import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeProp } from '../../types';

export type DatePickerProps = {
  /** Currently selected date (controlled). */
  value: Date;
  /** Called when the user selects a day. */
  onChange: (date: Date) => void;
  /** Earliest selectable date. Days before this are disabled. */
  min?: Date;
  /** Latest selectable date. Days after this are disabled. */
  max?: Date;
  /** 0 = Sunday .. 6 = Saturday. @default 0 */
  weekStartsOn?: number;
  /** Style applied to the container. */
  style?: StyleProp<ViewStyle>;
  /** @optional */
  theme?: ThemeProp;
  /** TestID for testing. */
  testID?: string;
};
