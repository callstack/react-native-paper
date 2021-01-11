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
import { withTheme } from '../../core/theming';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Menu from '../Menu/Menu';
import Button from '../Button';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * The currently visible page (starting with 0).
   */
  page: number;
  /**
   * The total number of pages.
   */
  numberOfPages: number;
  /**
   * Label text for oprions select to display
   */
  optionsLabel?: React.ReactNode;
  /**
   * Options for a number of rows per page to choose from
   */
  optionsPerPage?: Array<number>;
  /**
   * The current number of rows per page
   */
  itemsPerPage?: number;
  /**
   * The function to set the number of rows per page
   */
  setItemsPerPage?: (itemsPerPage: number) => void;
  /**
   * Whether to show fast forward and fast rewind buttons in pagination. False by default
   */
  showFastPagination?: boolean;
  /**
   * Label text to display
   */
  label?: React.ReactNode;
  /**
   * Function to execute on page change.
   */
  onPageChange: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
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
 * const optionsPerPage = [2, 3, 4];
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
 *   const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);
 *   const from = page * itemsPerPage;
 *   const to = Math.min((page + 1) * itemsPerPage, items.length);
 *
 *   React.useEffect(() => {
 *      setPage(0);
 *   }, [itemsPerPage]);
 *
 *   return (
 *     <DataTable>
 *       <DataTable.Pagination
 *         page={page}
 *         numberOfPages={Math.ceil(items.length / itemsPerPage)}
 *         onPageChange={page => setPage(page)}
 *         label={`${from + 1}-${to} of ${items.length}`}
 *         showFastPagination
 *         optionsPerPage={optionsPerPage}
 *         itemsPerPage={itemsPerPage}
 *         setItemsPerPage={setItemsPerPage}
 *         optionsLabel={'Rows per page'}
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
  page,
  numberOfPages,
  onPageChange,
  style,
  theme,
  showFastPagination = false,
  optionsPerPage,
  itemsPerPage,
  setItemsPerPage,
  optionsLabel,
  ...rest
}: Props) => {
  const [showSelect, toggleSelect] = React.useState(false);
  const labelColor = color(theme.colors.text).alpha(0.6).rgb().string();

  return (
    <View {...rest} style={[styles.container, style]}>
      {optionsPerPage && itemsPerPage && setItemsPerPage ? (
        <>
          <Text
            style={[styles.optionsLabel, { color: labelColor }]}
            numberOfLines={1}
          >
            {optionsLabel}
          </Text>
          <Menu
            visible={showSelect}
            onDismiss={() => toggleSelect(!showSelect)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => toggleSelect(true)}
                style={styles.button}
                icon={'menu-down'}
                contentStyle={styles.contentStyle}
              >
                {`${itemsPerPage}`}
              </Button>
            }
          >
            {optionsPerPage.map((option) => (
              <Menu.Item
                key={option}
                titleStyle={{
                  color:
                    option === itemsPerPage ? theme.colors.primary : undefined,
                }}
                onPress={() => {
                  setItemsPerPage?.(option);
                  toggleSelect(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </>
      ) : null}
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={2}>
        {label}
      </Text>
      <View style={styles.iconsConrainer}>
        {showFastPagination ? (
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcon
                name="page-first"
                color={color}
                size={size}
                direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
              />
            )}
            color={theme.colors.text}
            disabled={page === 0}
            onPress={() => onPageChange(0)}
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
          color={theme.colors.text}
          disabled={page === 0}
          onPress={() => onPageChange(page - 1)}
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
          color={theme.colors.text}
          disabled={numberOfPages === 0 || page === numberOfPages - 1}
          onPress={() => onPageChange(page + 1)}
        />
        {showFastPagination ? (
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcon
                name="page-last"
                color={color}
                size={size}
                direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
              />
            )}
            color={theme.colors.text}
            disabled={numberOfPages === 0 || page === numberOfPages - 1}
            onPress={() => onPageChange(numberOfPages - 1)}
          />
        ) : null}
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
  label: {
    fontSize: 12,
    marginRight: 44,
  },
  optionsLabel: {
    fontSize: 12,
    marginRight: 16,
  },
  button: {
    textAlign: 'center',
    marginRight: 44,
  },
  iconsConrainer: {
    flexDirection: 'row',
  },
  contentStyle: {
    flexDirection: 'row-reverse',
  },
});

export default withTheme(DataTablePagination);

// @component-docs ignore-next-line
export { DataTablePagination };
