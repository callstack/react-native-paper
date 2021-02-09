import * as React from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { useTheme } from '../../core/theming';
import DropdownContent from './DropdownContent';
import HelperText from '../HelperText';
import * as List from '../List/List';
import Portal from '../Portal/Portal';
import TextInput from '../TextInput/TextInput';
import type { RenderProps } from '../TextInput/types';

type Props<T> = {
  /**
   * Placeholder for the dropdown.
   */
  placeholder?: string;
  /**
   * The text to use for the floating label.
   */
  label?: string;
  /**
   * Required flag removes the possibility for the user to unselect a value once it's selected.
   */
  required?: boolean;
  /**
   * One or multiple Dropdown.Option elements.
   */
  children?: React.ReactNode;
  /**
   * Triggered when one of the options is selected or when unselected.
   */
  onSelect?: (selected: T | null) => void;
  /**
   * The option having this key will be selected
   * If undefined the currently selected option will remain selected.
   */
  selectedValue?: T | null;
  /**
   * This message will appear when the required prop is set to true and the number of children is zero.
   */
  emptyDropdownLabel?: string;
  /**
   * The label of the unselect option.
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
  /**
   * Mode of the TextInput.
   * - `flat` - flat input with an underline.
   * - `outlined` - input with an outline.
   *
   * In `outlined` mode, the background color of the label is derived from `colors.background` in theme or the `backgroundColor` style.
   * This component render TextInputOutlined or TextInputFlat based on that props
   */
  inputMode?: 'outlined' | 'flat';
  /**
   * Sets min height with densed layout. For `TextInput` in `flat` mode
   * height is `64dp` or in dense layout - `52dp` with label or `40dp` without label.
   * For `TextInput` in `outlined` mode
   * height is `56dp` or in dense layout - `40dp` regardless of label.
   * When you apply `heigh` prop in style the `dense` prop affects only `paddingVertical` inside `TextInput`
   */
  dense?: boolean;
  /**
   * Pass `fontSize` prop to modify the font size inside `TextInput`.
   * Pass `height` prop to set `TextInput` height. When `height` is passed,
   * `dense` prop will affect only input's `paddingVertical`.
   * Pass `paddingHorizontal` to modify horizontal padding.
   * This can be used to get MD Guidelines v1 TextInput look.
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

type OptionProps<T> = {
  value: T | null;
  renderLabel?: (props: RenderProps) => React.ReactNode;
  label?: string;
};

const DEFAULT_EMPTY_DROPDOWN_LABEL = 'No available options';
const DEFAULT_PLACEHOLDER_LABEL = 'Select an option';
const DROPDOWN_NULL_OPTION_KEY = 'DROPDOWN_NULL_OPTION_KEY';
// const DEFAULT_MAX_HEIGHT = Infinity;

export type DropdownContextProps<T> = {
  closeMenu(): void;
  selectOption(option: OptionProps<T> | null): void;
  required: boolean;
  emptyDropdownLabel: string;
  selectedValue?: T;
  mode: 'modal' | 'floating';
  anchor: View | null;
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
    // maxHeight = DEFAULT_MAX_HEIGHT,
    onSelect,
    placeholder = DEFAULT_PLACEHOLDER_LABEL,
    label,
    renderNoneOption,
    required = false,
    selectedValue,
    mode = Platform.select({ web: 'floating', default: 'modal' }),
    inputMode,
    dense,
    inputStyle,
  }: Props<T>,
  ref:
    | ((instance: DropdownRefAttributes<T> | null) => void)
    | React.MutableRefObject<DropdownRefAttributes<T> | null>
    | null
) {
  const theme = useTheme();
  const anchorRef = React.useRef<View>(null);
  const menuRef = React.useRef<View>(null);
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<OptionProps<T> | null>(null);

  const closeMenu = () => setMenuOpen(false);

  const openMenu = () => setMenuOpen(true);

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

  React.useEffect(() => {
    if (isMenuOpen) {
      const isBrowser = () => Platform.OS === 'web' && 'document' in global;

      const handleDismiss = () => {
        closeMenu();
        return true;
      };

      const handleKeypress = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMenu();
        }
      };

      BackHandler.addEventListener('hardwareBackPress', handleDismiss);
      Dimensions.addEventListener('change', handleDismiss);
      if (isBrowser()) {
        document.addEventListener('keyup', handleKeypress);
        document.addEventListener('click', handleDismiss);
      }

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleDismiss);
        Dimensions.removeEventListener('change', handleDismiss);

        if (isBrowser()) {
          document.removeEventListener('keyup', handleKeypress);
          document.removeEventListener('click', handleDismiss);
        }
      };
    }

    return undefined;
  }, [isMenuOpen]);

  React.useImperativeHandle(ref, () => ({
    closeMenu,
    openMenu,
    selectOption: (value) => setSelected(findSelectedOption(value, children)),
  }));

  return (
    <View ref={anchorRef} collapsable={false}>
      <TouchableRipple borderless onPress={openMenu}>
        <TextInput
          render={selected?.renderLabel}
          style={inputStyle}
          dense={dense}
          focusable={true}
          mode={inputMode}
          editable={false}
          value={selected?.label ?? ''}
          label={label}
          placeholder={placeholder}
          onFocus={openMenu}
          right={<TextInput.Icon name="menu-down" onPress={openMenu} />}
        />
      </TouchableRipple>
      <Portal>
        <DropdownContext.Provider
          value={{
            selectedValue: selected?.value,
            emptyDropdownLabel,
            required,
            closeMenu,
            selectOption,
            mode,
            anchor: anchorRef.current,
          }}
        >
          <DropdownContent visible={isMenuOpen}>
            <View ref={menuRef} collapsable={false}>
              {renderOptions()}
            </View>
          </DropdownContent>
        </DropdownContext.Provider>
      </Portal>
    </View>
  );
}) as (<T = any>(
  props: Props<T>,
  ref: React.RefObject<DropdownRefAttributes<T>>
) => JSX.Element) & { displayName: string };

Dropdown.displayName = 'Dropdown';

export default Dropdown;
