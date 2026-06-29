import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Menu from '../Menu/Menu';
import Text from '../Typography/Text';

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
  theme: themeOverrides,
}: PaginationControlsProps) => {
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
          aria-label="page-first"
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
        aria-label="chevron-left"
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
        aria-label="chevron-right"
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
          aria-label="page-last"
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
  theme: themeOverrides,
}: PaginationDropdownProps) => {
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

  return (
    <View
      {...rest}
      style={[styles.container, style]}
      aria-label="pagination-container"
    >
      {numberOfItemsPerPageList &&
        numberOfItemsPerPage &&
        onItemsPerPageChange && (
          <View
            aria-label="Options Select"
            testID="options-select"
            style={styles.optionsContainer}
          >
            <Text
              variant="bodySmall"
              style={[styles.label, { color: labelColor }]}
              numberOfLines={3}
              testID="select-page-dropdown-label"
              aria-label={
                selectPageDropdownAccessibilityLabel ||
                'selectPageDropdownLabel'
              }
            >
              {selectPageDropdownLabel}
            </Text>
            <PaginationDropdown
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={numberOfItemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              theme={theme}
            />
          </View>
        )}
      <Text
        variant="bodySmall"
        style={[styles.label, { color: labelColor }]}
        numberOfLines={3}
        aria-label={accessibilityLabel || 'label'}
      >
        {label}
      </Text>
      <View style={styles.iconsContainer}>
        <PaginationControls
          showFastPaginationControls={showFastPaginationControls}
          onPageChange={onPageChange}
          page={page}
          numberOfPages={numberOfPages}
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
    paddingLeft: 16,
    flexWrap: 'wrap',
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    marginRight: 16,
  },
  button: {
    textAlign: 'center',
    marginRight: 16,
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
