import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { HORIZONTAL_PADDING } from './tokens';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Menu from '../Menu/Menu';
import Text from '../Typography/Text';

export type DataTablePaginationLabels = {
  /**
   * Accessible name for the pagination region. Used on the web, where it names
   * a real ARIA group. Defaults to `'Pagination'`.
   */
  container?: string;
  /**
   * Accessible name for the rows-per-page selector. Defaults to
   * `'Rows per page'`.
   */
  itemsPerPage?: string;
  /**
   * Defaults to `'First page'`.
   */
  firstPage?: string;
  /**
   * Defaults to `'Previous page'`.
   */
  previousPage?: string;
  /**
   * Defaults to `'Next page'`.
   */
  nextPage?: string;
  /**
   * Defaults to `'Last page'`.
   */
  lastPage?: string;
  /**
   * Accessible name for the visible-range label, used when no `label` is
   * given. Receives 1-based page numbers. Defaults to
   * `` ({ page, numberOfPages }) => `Page ${page} of ${numberOfPages}` ``.
   */
  pageStatus?: (info: { page: number; numberOfPages: number }) => string;
};

const defaultLabels: Required<DataTablePaginationLabels> = {
  container: 'Pagination',
  itemsPerPage: 'Rows per page',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  pageStatus: ({ page, numberOfPages }) => `Page ${page} of ${numberOfPages}`,
};

export type Props = ViewProps &
  PaginationControlsProps &
  PaginationDropdownProps & {
    /**
     * Label text for select page dropdown to display.
     */
    selectPageDropdownLabel?: React.ReactNode;
    /**
     * AccessibilityLabel for `selectPageDropdownLabel`.
     */
    selectPageDropdownAccessibilityLabel?: string;
    /**
     * Label text to display which indicates current pagination.
     */
    label?: React.ReactNode;
    /**
     * AccessibilityLabel for `label`.
     */
    'aria-label'?: string;
    /**
     * Wording of the controls' accessible names. Pass this to localize them.
     */
    labels?: DataTablePaginationLabels;
    style?: StyleProp<ViewStyle>;
    /**
     * @optional
     */
    theme?: ThemeProp;
  };

type PaginationDropdownProps = {
  /**
   * The current number of rows per page.
   */
  numberOfItemsPerPage?: number;
  /**
   * Options for a number of rows per page to choose from.
   */
  numberOfItemsPerPageList?: Array<number>;
  /**
   * The function to set the number of rows per page.
   */
  onItemsPerPageChange?: (numberOfItemsPerPage: number) => void;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

type PaginationControlsProps = {
  /**
   * The currently visible page (starting with 0).
   */
  page: number;
  /**
   * The total number of pages.
   */
  numberOfPages: number;
  /**
   * Function to execute on page change.
   */
  onPageChange: (page: number) => void;
  /**
   * Whether to show fast forward and fast rewind buttons in pagination. False by default.
   */
  showFastPaginationControls?: boolean;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const PaginationControls = ({
  page,
  numberOfPages,
  onPageChange,
  showFastPaginationControls,
  labels,
  theme: themeOverrides,
}: PaginationControlsProps & {
  labels: Required<DataTablePaginationLabels>;
}) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();

  const textColor = theme.colors.onSurface;

  return (
    <>
      {showFastPaginationControls ? (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcon
              name="page-first"
              color={color}
              size={size}
              direction={direction}
            />
          )}
          iconColor={textColor}
          disabled={page === 0}
          onPress={() => onPageChange(0)}
          aria-label={labels.firstPage}
          theme={theme}
        />
      ) : null}
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-left"
            color={color}
            size={size}
            direction={direction}
          />
        )}
        iconColor={textColor}
        disabled={page === 0}
        onPress={() => onPageChange(page - 1)}
        aria-label={labels.previousPage}
        theme={theme}
      />
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-right"
            color={color}
            size={size}
            direction={direction}
          />
        )}
        iconColor={textColor}
        disabled={numberOfPages === 0 || page === numberOfPages - 1}
        onPress={() => onPageChange(page + 1)}
        aria-label={labels.nextPage}
        theme={theme}
      />
      {showFastPaginationControls ? (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcon
              name="page-last"
              color={color}
              size={size}
              direction={direction}
            />
          )}
          iconColor={textColor}
          disabled={numberOfPages === 0 || page === numberOfPages - 1}
          onPress={() => onPageChange(numberOfPages - 1)}
          aria-label={labels.lastPage}
          theme={theme}
        />
      ) : null}
    </>
  );
};

const PaginationDropdown = ({
  numberOfItemsPerPageList,
  numberOfItemsPerPage,
  onItemsPerPageChange,
  labels,
  theme: themeOverrides,
}: PaginationDropdownProps & {
  labels: Required<DataTablePaginationLabels>;
}) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme;
  const [showSelect, toggleSelect] = React.useState<boolean>(false);

  return (
    <Menu
      visible={showSelect}
      onDismiss={() => toggleSelect(!showSelect)}
      theme={theme}
      anchor={
        <Button
          mode="outlined"
          onPress={() => toggleSelect(true)}
          style={styles.button}
          icon="menu-down"
          contentStyle={styles.contentStyle}
          aria-label={`${labels.itemsPerPage}, ${numberOfItemsPerPage}`}
          aria-expanded={showSelect}
          theme={theme}
        >
          {`${numberOfItemsPerPage}`}
        </Button>
      }
    >
      {numberOfItemsPerPageList?.map((option) => (
        <Menu.Item
          key={option}
          titleStyle={
            option === numberOfItemsPerPage && {
              color: colors?.primary,
            }
          }
          onPress={() => {
            onItemsPerPageChange?.(option);
            toggleSelect(false);
          }}
          title={option}
          theme={theme}
        />
      ))}
    </Menu>
  );
};

/**
 * A component to show pagination for data table.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const numberOfItemsPerPageList = [2, 3, 4];
 *
 * const items = [
 *   {
 *     key: 1,
 *     name: 'Page 1',
 *   },
 *   {
 *     key: 2,
 *     name: 'Page 2',
 *   },
 *   {
 *     key: 3,
 *     name: 'Page 3',
 *   },
 * ];
 *
 * const MyComponent = () => {
 *   const [page, setPage] = React.useState(0);
 *   const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
 *   const from = page * numberOfItemsPerPage;
 *   const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);
 *
 *   React.useEffect(() => {
 *      setPage(0);
 *   }, [numberOfItemsPerPage]);
 *
 *   return (
 *     <DataTable>
 *       <DataTable.Pagination
 *         page={page}
 *         numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
 *         onPageChange={page => setPage(page)}
 *         label={`${from + 1}-${to} of ${items.length}`}
 *         showFastPaginationControls
 *         numberOfItemsPerPageList={numberOfItemsPerPageList}
 *         numberOfItemsPerPage={numberOfItemsPerPage}
 *         onItemsPerPageChange={onItemsPerPageChange}
 *         selectPageDropdownLabel={'Rows per page'}
 *       />
 *     </DataTable>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DataTablePagination = ({
  label,
  'aria-label': accessibilityLabel,
  labels: labelOverrides,
  page,
  numberOfPages,
  onPageChange,
  style,
  showFastPaginationControls = false,
  numberOfItemsPerPageList,
  numberOfItemsPerPage,
  onItemsPerPageChange,
  selectPageDropdownLabel,
  selectPageDropdownAccessibilityLabel,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const labelColor = theme.colors.onSurfaceVariant;

  const labels = React.useMemo(
    () => ({ ...defaultLabels, ...labelOverrides }),
    [labelOverrides]
  );

  const isWeb = Platform.OS === 'web';
  const regionProps = isWeb
    ? { role: 'group' as const, 'aria-label': labels.container }
    : null;

  const textIsFocusUnit = isWeb ? undefined : true;

  return (
    <View {...regionProps} {...rest} style={[styles.container, style]}>
      {numberOfItemsPerPageList &&
        numberOfItemsPerPage &&
        onItemsPerPageChange && (
          <View testID="options-select" style={styles.optionsContainer}>
            <Text
              style={[styles.label, { color: labelColor }]}
              numberOfLines={3}
              testID="select-page-dropdown-label"
              accessible={textIsFocusUnit}
              aria-label={selectPageDropdownAccessibilityLabel}
            >
              {selectPageDropdownLabel}
            </Text>
            <PaginationDropdown
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={numberOfItemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              labels={labels}
              theme={theme}
            />
          </View>
        )}
      <Text
        style={[styles.label, { color: labelColor }]}
        numberOfLines={3}
        accessible={textIsFocusUnit}
        aria-label={
          accessibilityLabel ??
          (label != null
            ? undefined
            : labels.pageStatus({ page: page + 1, numberOfPages }))
        }
      >
        {label}
      </Text>
      <View style={styles.iconsContainer}>
        <PaginationControls
          showFastPaginationControls={showFastPaginationControls}
          onPageChange={onPageChange}
          page={page}
          numberOfPages={numberOfPages}
          labels={labels}
          theme={theme}
        />
      </View>
    </View>
  );
};

DataTablePagination.displayName = 'DataTable.Pagination';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: HORIZONTAL_PADDING,
    flexWrap: 'wrap',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    marginEnd: HORIZONTAL_PADDING,
  },
  button: {
    marginEnd: HORIZONTAL_PADDING,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  contentStyle: {
    flexDirection: 'row-reverse',
  },
});

export default DataTablePagination;

// @component-docs ignore-next-line
export { DataTablePagination };
