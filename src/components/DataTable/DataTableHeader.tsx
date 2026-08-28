import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import useLatestCallback from 'use-latest-callback';

import { withColumnIndices } from './DataTableColumnsContext';
import { DataTableContext, DataTableRowContext } from './DataTableContext';
import type { Props as DataTableTitleProps } from './DataTableTitle';
import { HORIZONTAL_PADDING } from './tokens';
import { getElementLabel, isDataTableElement } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import webAriaProps from '../../utils/webAriaProps';

export type Props = ViewProps & {
  /**
   * Content of the `DataTableHeader`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to display title in table header.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <DataTable>
 *     <DataTable.Header>
 *       <DataTable.Title
 *         sortDirection='descending'
 *       >
 *         Dessert
 *       </DataTable.Title>
 *       <DataTable.Title numeric>Calories</DataTable.Title>
 *       <DataTable.Title numeric>Fat (g)</DataTable.Title>
 *     </DataTable.Header>
 *   </DataTable>
 * );
 *
 * export default MyComponent;
 * ```
 */

const DataTableHeader = ({
  children,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const table = React.useContext(DataTableContext);
  const borderBottomColor = theme.colors.outlineVariant;

  const labels = React.useMemo(() => {
    const labels: Array<string | undefined> = [];

    React.Children.forEach(children, (child, index) => {
      labels[index] = isDataTableElement<DataTableTitleProps>(
        child,
        'DataTable.Title'
      )
        ? getElementLabel(child.props)
        : undefined;
    });

    return labels;
  }, [children]);

  const setHeaderLabels = table?.setHeaderLabels;
  const publish = useLatestCallback(() => setHeaderLabels?.(labels));
  const signature = labels.join(' ');

  React.useEffect(publish, [publish, signature]);

  React.useEffect(() => () => setHeaderLabels?.(null), [setHeaderLabels]);

  const rowContext = React.useMemo(
    () => ({ header: true, rowIsFocusUnit: false }),
    []
  );

  return (
    <DataTableRowContext.Provider value={rowContext}>
      <View
        role="row"
        {...webAriaProps({ 'aria-rowindex': 1 })}
        {...rest}
        style={[styles.header, { borderBottomColor }, style]}
      >
        {withColumnIndices(children)}
      </View>
    </DataTableRowContext.Provider>
  );
};

DataTableHeader.displayName = 'DataTable.Header';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
});

export default DataTableHeader;

// @component-docs ignore-next-line
export { DataTableHeader };
