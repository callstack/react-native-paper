import React, { ReactElement, useEffect, useState } from 'react';
import { View } from 'react-native';

import DropdownContext from './DropdownContext';
import { Props as DropdownItemProps } from './DropdownItem';
import Menu from '../Menu/Menu';
import TextInput, { Props as TextInputProps } from '../TextInput/TextInput';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export interface Props extends Omit<TextInputProps, 'value' | 'onChange'> {
  /**
   * List of underlying dropdown options.
   */
  children?:
    | ReactElement<DropdownItemProps>
    | Array<ReactElement<DropdownItemProps>>;
  /**
   * Callback called when the selected option changes.
   * @param value new selected value
   */
  onChange?: (value: string | null) => void;
  /**
   * Currently selected value in the dropdown. When undefined, the dropdown behaves as an uncontrolled input.
   */
  value?: string | null;
  /**
   * Text displayed in the underlying TextInput. When undefined, the text displayed is equal to the selected value.
   */
  valueText?: string;
  /**
   * Initial value for the dropdown.
   */
  defaultValue?: string;
  /**
   * The clear button will show by default to remove the current value.
   * If required is set to true, this button will not appear.
   */
  required?: boolean;
}

/**
 * Dropdowns present a list of options which a user can select from.
 * A selected option can represent a value in a form, or can be used as an action to filter or sort existing content.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Dropdown, Provider, Text, Title } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [selected, setSelected] = React.useState(null);
 *   const options = [
 *     {id: 1, name: 'Cookie', calories: 502},
 *     {id: 2, name: 'Candy', calories: 535},
 *   ];
 *
 *   return (
 *     <Provider>
 *       <Dropdown onChange={setSelected}>
 *         {options.map(option => (
 *           <Dropdown.Item
 *            value={option.name}
 *            title={option.name}
 *            key={value.id}
 *            label={value.name}
 *           />
 *         ))}
 *       </Dropdown>
 *       <Title>{selectedOption}</Title>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Dropdown = ({
  value: valueFromProps,
  valueText: valueTextFromProps,
  required,
  onChange,
  children,
  defaultValue,
  ...textInputProps
}: Props) => {
  const isControlled = typeof valueFromProps !== 'undefined';

  const [menu, setMenu] = useState<View | null>(null);
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null
  );

  useEffect(() => {
    menu?.measureInWindow((_x, _y, width, _height) => {
      setWidth(width);
    });
  }, [open, menu]);

  useEffect(() => {
    if (typeof valueFromProps !== 'undefined') {
      setInternalValue(valueFromProps);
    }
  }, [valueFromProps]);

  const value = isControlled ? valueFromProps : internalValue;
  const valueText =
    typeof valueTextFromProps !== 'undefined' ? valueTextFromProps : value;

  return (
    <View>
      <Menu
        anchor={
          <View ref={setMenu}>
            <TouchableRipple onPress={() => setOpen(true)}>
              <TextInput
                editable={false}
                right={
                  value && !required ? (
                    <TextInput.Icon
                      icon="close-circle-outline"
                      onPress={() => {
                        onChange?.(null);
                        setInternalValue(null);
                      }}
                    />
                  ) : undefined
                }
                value={valueText ?? ''}
                {...textInputProps}
              />
            </TouchableRipple>
          </View>
        }
        anchorPosition="bottom"
        contentStyle={{ width: width }}
        visible={open}
        onDismiss={() => setOpen(false)}
      >
        <DropdownContext.Provider
          value={{
            onChange: (newValue: string) => {
              setInternalValue(newValue);
              onChange?.(newValue);
              setOpen(false);
            },
          }}
        >
          {children}
        </DropdownContext.Provider>
      </Menu>
    </View>
  );
};

export default Dropdown;
