import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  I18nManager,
} from 'react-native';
import color from 'color';
import IconButton from '../IconButton';
import Text from '../Typography/Text';
import { withTheme, useTheme } from '../../core/theming';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Menu from '../Menu/Menu';
import Button from '../Button';

export type Props = React.ComponentPropsWithRef<typeof View> &
  PaginationControlsProps &
  PaginationDropdownProps & {
    /**
     * Label text to display which indicates current pagination.
     */
    label?: React.ReactNode;
    /**
     * AccessibilityLabel for `label`.
     */
    accessibilityLabel?: string;
    /**
     * Label text for select page dropdown to display.
     */
    selectPageDropdownLabel?: React.ReactNode;
    /**
     * AccessibilityLabel for `selectPageDropdownLabel`.
     */
    selectPageDropdownAccessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
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
};

const PaginationControls = ({
  page,
  numberOfPages,
  onPageChange,
  showFastPaginationControls,
}: PaginationControlsProps) => {
  const { colors } = useTheme();
  return (
    <>
      {showFastPaginationControls ? (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcon
              name="page-first"
              color={color}
              size={size}
              direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
            />
          )}
          color={colors.text}
          disabled={page === 0}
          onPress={() => onPageChange(0)}
          accessibilityLabel="page-first"
        />
      ) : null}
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-left"
            color={color}
            size={size}
            direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
          />
        )}
        color={colors.text}
        disabled={page === 0}
        onPress={() => onPageChange(page - 1)}
        accessibilityLabel="chevron-left"
      />
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-right"
            color={color}
            size={size}
            direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
          />
        )}
        color={colors.text}
        disabled={numberOfPages === 0 || page === numberOfPages - 1}
        onPress={() => onPageChange(page + 1)}
        accessibilityLabel="chevron-right"
      />
      {showFastPaginationControls ? (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcon
              name="page-last"
              color={color}
              size={size}
              direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
            />
          )}
          color={colors.text}
          disabled={numberOfPages === 0 || page === numberOfPages - 1}
          onPress={() => onPageChange(numberOfPages - 1)}
          accessibilityLabel="page-last"
        />
      ) : null}
    </>
  );
};

const PaginationDropdown = ({
  numberOfItemsPerPageList,
  numberOfItemsPerPage,
  onItemsPerPageChange,
}: PaginationDropdownProps) => {
  const { colors } = useTheme();
  const [showSelect, toggleSelect] = React.useState<boolean>(false);

  return (
    <Menu
      visible={showSelect}
      onDismiss={() => toggleSelect(!showSelect)}
      anchor={
        <Button
          mode="outlined"
          onPress={() => toggleSelect(true)}
          style={styles.button}
          icon="menu-down"
          contentStyle={styles.contentStyle}
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
              color: colors.primary,
            }
          }
          onPress={() => {
            onItemsPerPageChange?.(option);
            toggleSelect(false);
          }}
          title={option}
        />
      ))}
    </Menu>
  );
};

/**
 * A component to show pagination for data table.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/data-table-pagination.png" />
 *   </figure>
 * </div>
 *
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
  accessibilityLabel,
  page,
  numberOfPages,
  onPageChange,
  style,
  theme,
  showFastPaginationControls = false,
  numberOfItemsPerPageList,
  numberOfItemsPerPage,
  onItemsPerPageChange,
  selectPageDropdownLabel,
  selectPageDropdownAccessibilityLabel,
  ...rest
}: Props) => {
  const labelColor = color(theme.colors.text).alpha(0.6).rgb().string();

  return (
    <View
      {...rest}
      style={[styles.container, style]}
      accessibilityLabel="pagination-container"
    >
      {numberOfItemsPerPageList &&
        numberOfItemsPerPage &&
        onItemsPerPageChange && (
          <View
            accessibilityLabel="Options Select"
            style={styles.optionsContainer}
          >
            <Text
              style={[styles.label, { color: labelColor }]}
              numberOfLines={3}
              accessibilityLabel={
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
            />
          </View>
        )}
      <Text
        style={[styles.label, { color: labelColor }]}
        numberOfLines={3}
        accessibilityLabel={accessibilityLabel || 'label'}
      >
        {label}
      </Text>
      <View style={styles.iconsContainer}>
        <PaginationControls
          showFastPaginationControls={showFastPaginationControls}
          onPageChange={onPageChange}
          page={page}
          numberOfPages={numberOfPages}
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
    fontSize: 12,
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

export default withTheme(DataTablePagination);

// @component-docs ignore-next-line
export { DataTablePagination };
