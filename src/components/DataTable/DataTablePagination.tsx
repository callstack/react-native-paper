import * as React from 'react';
import {
  ColorValue,
  I18nManager,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';
import type { ThemeProp } from 'src/types';

import { useInternalTheme } from '../../core/theming';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Menu from '../Menu/Menu';
import Text from '../Typography/Text';

export type Props = React.ComponentPropsWithRef<typeof View> &
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
    accessibilityLabel?: string;
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
   * Color of the dropdown item ripple effect.
   */
  dropdownItemRippleColor?: ColorValue;
  /**
   * Color of the select page dropdown ripple effect.
   */
  selectPageDropdownRippleColor?: ColorValue;
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
   * Color of the pagination control ripple effect.
   */
  paginationControlRippleColor?: ColorValue;
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
  paginationControlRippleColor,
}: PaginationControlsProps) => {
  const theme = useInternalTheme(themeOverrides);

  const textColor = theme.isV3 ? theme.colors.onSurface : theme.colors.text;

  return (
    <>
      {showFastPaginationControls ? (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcon
              name="page-first"
              color={color}
              size={size}
              direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
            />
          )}
          iconColor={textColor}
          rippleColor={paginationControlRippleColor}
          disabled={page === 0}
          onPress={() => onPageChange(0)}
          accessibilityLabel="page-first"
          theme={theme}
        />
      ) : null}
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-left"
            color={color}
            size={size}
            direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
          />
        )}
        iconColor={textColor}
        rippleColor={paginationControlRippleColor}
        disabled={page === 0}
        onPress={() => onPageChange(page - 1)}
        accessibilityLabel="chevron-left"
        theme={theme}
      />
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-right"
            color={color}
            size={size}
            direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
          />
        )}
        iconColor={textColor}
        rippleColor={paginationControlRippleColor}
        disabled={numberOfPages === 0 || page === numberOfPages - 1}
        onPress={() => onPageChange(page + 1)}
        accessibilityLabel="chevron-right"
        theme={theme}
      />
      {showFastPaginationControls ? (
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcon
              name="page-last"
              color={color}
              size={size}
              direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
            />
          )}
          iconColor={textColor}
          rippleColor={paginationControlRippleColor}
          disabled={numberOfPages === 0 || page === numberOfPages - 1}
          onPress={() => onPageChange(numberOfPages - 1)}
          accessibilityLabel="page-last"
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
  selectPageDropdownRippleColor,
  dropdownItemRippleColor,
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
          rippleColor={selectPageDropdownRippleColor}
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
          rippleColor={dropdownItemRippleColor}
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
  accessibilityLabel,
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
  selectPageDropdownRippleColor,
  dropdownItemRippleColor,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const labelColor = color(
    theme.isV3 ? theme.colors.onSurface : theme?.colors.text
  )
    .alpha(0.6)
    .rgb()
    .string();

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
              selectPageDropdownRippleColor={selectPageDropdownRippleColor}
              dropdownItemRippleColor={dropdownItemRippleColor}
              theme={theme}
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

export default DataTablePagination;

// @component-docs ignore-next-line
export { DataTablePagination };
