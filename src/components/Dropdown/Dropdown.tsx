import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import IconButton from '../IconButton';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import DropdownOption, { Props as OptionProps } from './DropdownOption';
import DropdownContent from './DropdownContent';
import HelperText from '../HelperText';
import * as List from '../List/List';
import Portal from '../Portal/Portal';

type Props<T> = {
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
  children: React.ReactNode;
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
  emptyDropdownMessage?: string;
  /**
   * The label of the unselect option
   */
  renderNoneOption?: () => React.ReactNode;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type State<T> = {
  coordinates: { top: number; left: number; width: number };
  isOpen: boolean;
  selectedOption: OptionProps<T> | null;
};

const DEFAULT_EMPTY_DROPDOWN_LABEL = 'No available options';
const DEFAULT_PLACEHOLDER_LABEL = 'Select an option';
const DROPDOWN_NULL_OPTION_KEY = 'DROPDOWN_NULL_OPTION_KEY';

export type DropdownProps<T> = {
  closeMenu(): void;
  onSelect(option: OptionProps<T> | null): void;
  setSelectedValue(option: OptionProps<T> | null): void;
  maxHeight?: number;
  required: boolean;
  emptyDropdownLabel: string;
  selectedValue?: T;
  dropdownCoordinates: {
    top: number;
    left: number;
    width: number;
  };
};

export const DropdownContext = React.createContext<DropdownProps<any>>(
  null as any
);

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
 *            optionKey={value.id}
 *            title={value.name}
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
class Dropdown<T = any> extends React.Component<Props<T>, State<T>> {
  static displayName = 'Dropdown';

  // @component ./DropdownOption.tsx
  static Option = DropdownOption;

  static getDerivedStateFromProps<T>(nextProps: Props<T>) {
    if (nextProps.selectedValue !== undefined) {
      const selectedOption = React.Children.toArray(nextProps.children)
        .map((child) => (child as any)?.props)
        .find((props) => props?.value === nextProps.selectedValue);
      return { selectedOption };
    }
    return null;
  }

  popupViewRef: React.RefObject<View>;

  constructor(props: Props<T>) {
    super(props);

    this.popupViewRef = React.createRef();
    this.state = {
      isOpen: false,
      coordinates: { top: 0, left: 0, width: 0 },
      selectedOption: null,
    };
  }

  public openMenu = () => this.setMenuOpen(true);

  public closeMenu = () => this.setMenuOpen(false);

  public toggleMenuOpen = () => this.setMenuOpen(!this.state.isOpen);

  render() {
    const theme = this.props.theme;
    return (
      <View ref={this.popupViewRef}>
        <TouchableRipple borderless onPress={this.toggleMenuOpen}>
          <Surface
            style={[
              styles.container,
              {
                borderRadius: theme.roundness,
                borderColor: this.state.isOpen
                  ? theme.colors.primary
                  : theme.colors.backdrop,
              },
            ]}
          >
            <View style={styles.label}>{this.renderLabel()}</View>
            <IconButton
              style={styles.icon}
              icon="menu-down"
              onPress={this.toggleMenuOpen}
            />
          </Surface>
        </TouchableRipple>
        {this.state.isOpen && (
          <Portal>
            <DropdownContext.Provider
              value={{
                setSelectedValue: (option: OptionProps<T> | null) =>
                  this.setState({ selectedOption: option }),
                selectedValue: this.props.selectedValue,
                maxHeight: this.props.maxHeight,
                closeMenu: this.closeMenu,
                dropdownCoordinates: this.state.coordinates,
                emptyDropdownLabel:
                  this.props.emptyDropdownMessage ??
                  DEFAULT_EMPTY_DROPDOWN_LABEL,
                required: this.props.required ?? false,
                onSelect: this.onSelect,
              }}
            >
              <DropdownContent>{this.renderOptions()}</DropdownContent>
            </DropdownContext.Provider>
          </Portal>
        )}
      </View>
    );
  }

  private setMenuOpen = (open: boolean) => {
    if (Platform.OS === 'web') {
      this.popupViewRef?.current?.measure(
        (_x, _y, width, height, pageX, pageY) =>
          this.setState({
            coordinates: {
              width: width,
              left: pageX,
              top: pageY + height,
            },
          })
      );
    }
    this.setState({ isOpen: open });
  };

  private onSelect = (option: OptionProps<T> | null) => {
    this.closeMenu();
    this.setState({ selectedOption: option });
    if (this.props.onSelect) {
      this.props.onSelect(option ? option.value : null);
    }
  };

  private renderOptions = () => {
    const {
      required,
      emptyDropdownMessage = DEFAULT_EMPTY_DROPDOWN_LABEL,
      renderNoneOption,
      placeholder = DEFAULT_PLACEHOLDER_LABEL,
    } = this.props;
    const options = React.Children.toArray(this.props.children);

    if (!required && options.length === 0) {
      options.push(<HelperText type="info">{emptyDropdownMessage}</HelperText>);
    } else if (!required) {
      const noneOption = renderNoneOption?.call(this);
      if (!noneOption || typeof noneOption === 'string') {
        options.unshift(
          <List.Item
            key={DROPDOWN_NULL_OPTION_KEY}
            style={styles.unselectOption}
            title={noneOption ?? placeholder}
            onPress={() => this.onSelect(null)}
          />
        );
      } else {
        options.unshift(
          <TouchableRipple
            key={DROPDOWN_NULL_OPTION_KEY}
            onPress={() => this.onSelect(null)}
          >
            {noneOption}
          </TouchableRipple>
        );
      }
    }

    return options;
  };

  private renderLabel = () => {
    const { selectedOption } = this.state;
    const { theme, placeholder = DEFAULT_PLACEHOLDER_LABEL } = this.props;

    if (selectedOption?.renderLabel) {
      return selectedOption.renderLabel();
    } else {
      return (
        <Text
          style={[
            styles.text,
            {
              color: selectedOption
                ? theme.colors.text
                : theme.colors.placeholder,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
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
  unselectOption: {
    opacity: 0.5,
  },
});

export default withTheme(Dropdown);
