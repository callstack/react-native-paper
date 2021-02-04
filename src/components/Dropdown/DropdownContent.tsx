import Surface from '../Surface';
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={[StyleSheet.absoluteFill]}>
        <Surface style={[dropdownCoordinates, { maxHeight }]}>
          <ScrollView>{props.children}</ScrollView>
        </Surface>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DropdownContent;
