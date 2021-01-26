import * as React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as List from '../List/List';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import IconButton from '../IconButton';
import Portal from '../Portal/Portal';
import Dialog from '../Dialog/Dialog';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import DropdownOption, { Props as OptionProps } from './DropdownOption';

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
  children?:
    | React.ReactElement<OptionProps<T>>[]
    | React.ReactElement<OptionProps<T>>;
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
  selectedKey?: React.Key | null;
  /**
   * This message will appear when the required prop is set to true and the number of children is zero
   */
  emptyDropdownMessage?: string;
  /**
   * The label of the unselect option
   */
  unselectLabel?: string;
  /**
   * Callback which returns a React element to display on the left side of the unselect option
   */
  unselectIcon?: (props: {
    color: string;
    style: {
      marginLeft: number;
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type State = {
  coordinates: { top: number; left: number; width: number };
  isOpen: boolean;
  selectedKey: React.Key | null;
};

const DEFAULT_EMPTY_DROPDOWN_LABEL = 'No available options';
const DEFAULT_PLACEHOLDER_LABEL = 'Select an option';
const DEFAULT_MAX_HEIGHT = 350;
const DROPDOWN_NULL_OPTION_KEY = 'DROPDOWN_NULL_OPTION_KEY';

const DropdownChild = <T extends any>(props: {
  props: OptionProps<T>;
  onPress: () => void;
}) => (
  <List.Item
    style={props.props.style}
    title={props.props.title}
    description={props.props.description}
    right={props.props.right}
    onPress={props.onPress}
    left={props.props.left}
    theme={props.props.theme}
  />
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
class Dropdown<T> extends React.Component<Props<T>, State> {
  static displayName = 'Dropdown';

  // @component ./DropdownOption.tsx
  static Option = DropdownOption;

  static getDerivedStateFromProps<T>(nextProps: Props<T>) {
    if (nextProps.selectedKey !== undefined) {
      return { selectedOption: nextProps.selectedKey };
    }
    return null;
  }

  popupViewRef: React.RefObject<View>;

  constructor(props: Props<T>) {
    super(props);

    this.popupViewRef = React.createRef();
    this.state = {
      isOpen: false,
      selectedKey: props.selectedKey ?? null,
      coordinates: { top: 0, left: 0, width: 0 },
    };
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

  public openMenu = () => this.setMenuOpen(true);

  public closeMenu = () => this.setMenuOpen(false);

  public toggleMenuOpen = () => this.setMenuOpen(!this.state.isOpen);

  public options = () =>
    React.Children.map<OptionProps<T>, React.ReactElement<OptionProps<T>>>(
      this.props.children ?? [],
      (child) => child.props
    );

  public selectedOption = () =>
    this.options().find(
      (option) => option.optionKey === this.state.selectedKey
    ) ?? null;

  private renderOptions = (options: OptionProps<T>[]) => {
    const {
      emptyDropdownMessage = DEFAULT_EMPTY_DROPDOWN_LABEL,
      unselectLabel = this.props.placeholder ?? DEFAULT_PLACEHOLDER_LABEL,
      unselectIcon,
      required = false,
      onSelect,
    } = this.props;

    let optionsList = options.map((option) => (
      <DropdownChild
        key={option.optionKey}
        props={option}
        onPress={() => {
          this.setState({ selectedKey: option.optionKey });
          this.closeMenu();
          if (onSelect) {
            onSelect(option.value);
          }
        }}
      />
    ));

    if (!required) {
      optionsList.unshift(
        <DropdownChild
          key={DROPDOWN_NULL_OPTION_KEY}
          props={{
            value: undefined,
            optionKey: DROPDOWN_NULL_OPTION_KEY,
            label: unselectLabel,
            title: unselectLabel,
            left: unselectIcon,
            style: styles.unselectOption,
          }}
          onPress={() => {
            this.setState({ selectedKey: null });
            this.closeMenu();
            if (onSelect) {
              onSelect(null);
            }
          }}
        />
      );
    } else if (options.length === 0) {
      optionsList.push(
        <List.Item
          key={DROPDOWN_NULL_OPTION_KEY}
          disabled
          title={emptyDropdownMessage}
        />
      );
    }
    return optionsList;
  };

  private optionLabel = (option: OptionProps<T> | null) => {
    if (option) {
      return option.label ?? option.title;
    }
    return this.props.placeholder ?? DEFAULT_PLACEHOLDER_LABEL;
  };

  render() {
    const { maxHeight = DEFAULT_MAX_HEIGHT, theme } = this.props;
    const selectedOption = this.selectedOption();
    const options = this.options();

    let optionsChildren = this.renderOptions(options);

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
              {this.optionLabel(selectedOption)}
            </Text>
            <IconButton
              style={styles.icon}
              icon="menu-down"
              onPress={this.toggleMenuOpen}
            />
          </Surface>
        </TouchableRipple>
        <Portal>
          {Platform.select({
            web: this.state.isOpen && (
              <TouchableWithoutFeedback
                style={styles.modalContainer}
                onPress={this.closeMenu}
              >
                <View style={styles.modal}>
                  <Surface
                    style={[this.state.coordinates, styles.modalContent]}
                  >
                    <ScrollView style={{ maxHeight: maxHeight }}>
                      {optionsChildren}
                    </ScrollView>
                  </Surface>
                </View>
              </TouchableWithoutFeedback>
            ),
            default: (
              <Dialog visible={this.state.isOpen} onDismiss={this.closeMenu}>
                <ScrollView>{optionsChildren}</ScrollView>
              </Dialog>
            ),
          })}
        </Portal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    elevation: 1,
  },
  text: {
    flex: 1,
    paddingHorizontal: 10,
  },
  icon: {
    margin: 2.5,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    width: '100%',
    height: '100%',
  },
  modalContent: {
    position: 'relative',
  },
  unselectOption: {
    opacity: 0.5,
  },
});

export default withTheme(Dropdown);
