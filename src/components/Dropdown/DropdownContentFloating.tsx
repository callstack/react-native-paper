import Surface from '../Surface';
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import { DropdownContext } from './Dropdown';
import { withTheme } from '../../core/theming';

type Props = {
  children: React.ReactNode;
  visible: boolean;
  theme: ReactNativePaper.Theme;
};

const DropdownContentFloating = ({ children, visible, theme }: Props) => {
  const { closeMenu, dropdownCoordinates } = React.useContext(DropdownContext);

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={[StyleSheet.absoluteFill]}>
        <Surface
          style={[
            dropdownCoordinates,
            styles.container,
            {
              borderBottomRightRadius: theme.roundness,
              borderBottomLeftRadius: theme.roundness,
            },
          ]}
        >
          <ScrollView>{children}</ScrollView>
        </Surface>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 8,
  },
});

export default withTheme(DropdownContentFloating);
