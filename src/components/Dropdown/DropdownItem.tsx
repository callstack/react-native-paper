import React, {useContext} from "react";
import {MenuItemProps} from "react-native-paper";
import MenuItem from "../Menu/MenuItem";
import DropdownContext from "./DropdownContext";

export interface Props extends Omit<MenuItemProps, 'onPress'> {
  value: string;
}

const DropdownItem = (props: Props) => {
  const dropdownContext = useContext(DropdownContext);

  return <MenuItem style={{maxWidth: undefined}} onPress={() => dropdownContext.onChange?.(props.value)} {...props}/>;
}


export default DropdownItem;
