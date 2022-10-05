import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import color from 'color';

import { withInternalTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import type { $RemoveChildren, InternalTheme } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Content of the `DataTableRow`.
   */
  children: React.ReactNode;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
  /**
   * `pointerEvents` passed to the `View` container, which is wrapping children within `TouchableRipple`.
   */
  pointerEvents?: ViewProps['pointerEvents'];
};

/**
 * A component to show a single row inside of a table.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/data-table-row-cell.png" />
 *   </figure>
 * </div>
 *
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *      <DataTable.Row>
 *        <DataTable.Cell numeric>1</DataTable.Cell>
 *        <DataTable.Cell numeric>2</DataTable.Cell>
 *        <DataTable.Cell numeric>3</DataTable.Cell>
 *        <DataTable.Cell numeric>4</DataTable.Cell>
 *      </DataTable.Row>
 * );
 *
 * export default MyComponent;
 * ```
 */

const DataTableRow = ({
  onPress,
  style,
  theme,
  children,
  pointerEvents,
  ...rest
}: Props) => {
  const borderBottomColor = theme.isV3
    ? theme.colors.surfaceVariant
    : color(theme.dark ? white : black)
        .alpha(0.12)
        .rgb()
        .string();

  return (
    <TouchableRipple
      {...rest}
      onPress={onPress}
      style={[styles.container, { borderBottomColor }, style]}
    >
      <View style={styles.content} pointerEvents={pointerEvents}>
        {children}
      </View>
    </TouchableRipple>
  );
};

DataTableRow.displayName = 'DataTable.Row';

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default withInternalTheme(DataTableRow);

// @component-docs ignore-next-line
export { DataTableRow };
