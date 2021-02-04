import Surface from '../Surface';
import { ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import React, { useContext } from 'react';
import { DropdownContext } from './Dropdown';

type Props = {
  children: React.ReactNode;
};

const DEFAULT_MAX_HEIGHT = 350;

const DropdownContent = (props: Props) => {
  const {
    closeMenu,
    dropdownCoordinates,
    maxHeight = DEFAULT_MAX_HEIGHT,
  } = useContext(DropdownContext);

  return (
    <TouchableWithoutFeedback
      style={[StyleSheet.absoluteFill]}
      onPress={closeMenu}
    >
      <Surface style={[dropdownCoordinates, { maxHeight }]}>
        <ScrollView>{props.children}</ScrollView>
      </Surface>
    </TouchableWithoutFeedback>
  );
};

export default DropdownContent;
