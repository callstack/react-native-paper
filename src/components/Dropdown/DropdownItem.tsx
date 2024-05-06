import React, { useContext } from 'react';

import DropdownContext from './DropdownContext';
import { Props as MenuItemProps } from '../Menu/MenuItem';
import MenuItem from '../Menu/MenuItem';

export interface Props extends Omit<MenuItemProps, 'onPress'> {
  value: string;
}

const DropdownItem = (props: Props) => {
  const dropdownContext = useContext(DropdownContext);

  return (
    <MenuItem
      style={{ maxWidth: undefined }}
      onPress={() => dropdownContext.onChange?.(props.value)}
      {...props}
    />
  );
};

export default DropdownItem;
