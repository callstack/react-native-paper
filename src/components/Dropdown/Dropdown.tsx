import * as React from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import IconButton from '../IconButton';
import Text from '../Typography/Text';
import { useTheme } from '../../core/theming';
import DropdownContent from './DropdownContent';
import HelperText from '../HelperText';
import * as List from '../List/List';
import Portal from '../Portal/Portal';
import { APPROX_STATUSBAR_HEIGHT } from '../../constants';

type Props<T> = {
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * This is automatically handled on iOS >= 11 including iPhone X using `SafeAreaView`.
   * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
   * Pass `0` or a custom value to disable the default behaviour, and customize the height.
   */
  statusBarHeight?: number;
  /**
   * Placeholder label when there is no selected value
   */
  placeholder?: string;
  /**
   * Required flag removes the possibility for the user to unselect a value once it's selected
   */
  required?: boolean;
  /**
   * One or multiple Dropdown.Option elements
   */
  children?: React.ReactNode;
  /**
   * Only for web, maximum height of the dropdown popup
   */
  maxHeight?: number;
  /**
   * Triggered when on of the options is selected or when unselected
   * @param selected the selected option value or null if nothing is selected
   */
  onSelect?: (selected: T | null) => void;
  /**
   * The option having this key will be selected
   * If undefined the currently selected option will remain selected
   */
  selectedValue?: T | null;
  /**
   * This message will appear when the required prop is set to true and the number of children is zero
   */
  emptyDropdownLabel?: string;
  /**
   * The label of the unselect option
   */
  renderNoneOption?: (props: {
    onPress: () => void;
    style: { color: string };
    key: React.Key;
  }) => React.ReactNode;
  /**
   * A dropdown can be either be rendered inside a modal or inside a floating menu
   * The default value is 'floating' if the platform is web and 'modal' otherwise
   */
  mode?: 'modal' | 'floating';
};

type OptionProps<T> = {
  value: T | null;
  renderLabel?: () => React.ReactNode;
  label?: string;
};

const DEFAULT_EMPTY_DROPDOWN_LABEL = 'No available options';
const DEFAULT_PLACEHOLDER_LABEL = 'Select an option';
const DROPDOWN_NULL_OPTION_KEY = 'DROPDOWN_NULL_OPTION_KEY';
const DEFAULT_MAX_HEIGHT = 350;

export type DropdownContextProps<T> = {
  closeMenu(): void;
  selectOption(option: OptionProps<T> | null): void;
  required: boolean;
  emptyDropdownLabel: string;
  selectedValue?: T;
  dropdownCoordinates: {
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight?: number;
  };
  mode: 'modal' | 'floating';
};

export type DropdownRefAttributes<T> = {
  openMenu: () => void;
  closeMenu: () => void;
  selectOption: (value: T | null) => void;
};

export const DropdownContext = React.createContext<DropdownContextProps<any>>(
  null as any
);

function findSelectedOption<T extends any>(
  value: T | null,
  children?: React.ReactNode
) {
  return React.Children.toArray(children)
    .map((child) => (child as any)?.props)
    .find((props) => props?.value === value);
}

/**
 * Dropdowns present a list of options from which a user can select one option.
 * A selected option can represent a value in a form, or can be used as an action to filter or sort existing content.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/dropdown.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Dropdown, Provider, Text, Title } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [selectedOption, setSelectedOption] = React.useState(null);
 *   const options = [
 *     {id: 1, name: 'Cookie', calories: 502},
 *     {id: 2, name: 'Candy', calories: 535},
 *   ];
 *
 *   return (
 *     <Provider>
 *       <Dropdown onSelect={setSelectedOption}>
 *         {options.map(option => (
 *           <Dropdown.Option
 *            value={option}
 *            key={value.id}
 *            label={value.name}
 *           />
 *         ))}
 *       </Dropdown>
 *       <Title>{selectedOption.name}</Title>
 *       <Text>{selectedOption.calories}</Text>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Dropdown = React.forwardRef(function <T>(
  {
    children,
    emptyDropdownLabel = DEFAULT_EMPTY_DROPDOWN_LABEL,
    maxHeight = DEFAULT_MAX_HEIGHT,
    onSelect,
    placeholder = DEFAULT_PLACEHOLDER_LABEL,
    renderNoneOption,
    required = false,
    selectedValue,
    mode = Platform.select({ web: 'floating', default: 'modal' }),
    statusBarHeight = APPROX_STATUSBAR_HEIGHT,
  }: Props<T>,
  ref:
    | ((instance: DropdownRefAttributes<T> | null) => void)
    | React.MutableRefObject<DropdownRefAttributes<T> | null>
    | null
) {
  const computedStatusBarHeight = Platform.select({
    android: statusBarHeight,
    default: 0,
  });
  const theme = useTheme();
  const anchorRef = React.useRef<View>(null);
  const menuRef = React.useRef<View>(null);
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [dropdownCoordinates, setMenuPosition] = React.useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight?: number;
  }>({
    left: 0,
    width: 0,
  });
  const [selected, setSelected] = React.useState<OptionProps<T> | null>(null);
  const windowHeight = Dimensions.get('window').height;

  const toggleMenuOpen = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const openMenu = () => {
    if (mode === 'floating') {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        let top = y + height + computedStatusBarHeight;
        setMenuPosition({
          left: x,
          width: width,
          top: top,
          bottom: 48,
          maxHeight: Math.min(maxHeight, windowHeight - top),
        });
      });
    }
    requestAnimationFrame(() => setMenuOpen(true));
  };

  const renderLabel = () => {
    if (selected?.renderLabel) {
      return selected.renderLabel();
    } else {
      return (
        <Text
          style={[
            styles.text,
            {
              color: selected ? theme.colors.text : theme.colors.placeholder,
            },
          ]}
        >
          {selected ? selected.label : placeholder}
        </Text>
      );
    }
  };

  const selectOption = (option: OptionProps<T> | null) => {
    closeMenu();
    setSelected(option);
    if (onSelect) {
      onSelect(option ? option.value : null);
    }
  };

  const renderOptions = () => {
    const options = React.Children.toArray(children);
    if (!required && options.length === 0) {
      options.push(
        <List.Item
          key={DROPDOWN_NULL_OPTION_KEY}
          title={<HelperText type="info">{emptyDropdownLabel}</HelperText>}
        />
      );
    } else if (!required) {
      const noneOption = renderNoneOption
        ? renderNoneOption({
            onPress: () => selectOption(null),
            style: { color: theme.colors.placeholder },
            key: DROPDOWN_NULL_OPTION_KEY,
          })
        : undefined;
      if (!noneOption || typeof noneOption === 'string') {
        options.unshift(
          <List.Item
            key={DROPDOWN_NULL_OPTION_KEY}
            titleStyle={{ color: theme.colors.placeholder }}
            title={noneOption ?? placeholder}
            onPress={() => selectOption(null)}
          />
        );
      } else {
        options.unshift(noneOption);
      }
    }
    return options;
  };

  React.useEffect(() => {
    if (selectedValue) {
      setSelected(findSelectedOption(selectedValue, children));
    }
  }, [children, selectedValue]);

  React.useImperativeHandle(ref, () => ({
    closeMenu,
    openMenu,
    selectOption: (value) => setSelected(findSelectedOption(value, children)),
  }));

  return (
    <View ref={anchorRef} collapsable={false}>
      <TouchableRipple borderless onPress={toggleMenuOpen}>
        <Surface
          style={[
            styles.container,
            {
              borderRadius: theme.roundness,
              borderColor: isMenuOpen
                ? theme.colors.primary
                : theme.colors.backdrop,
            },
          ]}
        >
          <View style={styles.label}>{renderLabel()}</View>
          <IconButton
            style={styles.icon}
            icon={isMenuOpen && mode === 'floating' ? 'menu-up' : 'menu-down'}
            onPress={toggleMenuOpen}
          />
        </Surface>
      </TouchableRipple>
      <Portal>
        <DropdownContext.Provider
          value={{
            selectedValue: selected?.value,
            dropdownCoordinates,
            emptyDropdownLabel,
            required,
            closeMenu,
            selectOption,
            mode,
          }}
        >
          <DropdownContent visible={isMenuOpen}>
            <View ref={menuRef}>{renderOptions()}</View>
          </DropdownContent>
        </DropdownContext.Provider>
      </Portal>
    </View>
  );
}) as (<T = any>(
  props: Props<T>,
  ref: React.RefObject<DropdownRefAttributes<T>>
) => JSX.Element) & { displayName: string };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1.2,
    alignItems: 'center',
    elevation: 1,
  },
  text: {
    paddingHorizontal: 10,
  },
  icon: {
    margin: 2.5,
  },
  label: {
    flex: 1,
  },
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
